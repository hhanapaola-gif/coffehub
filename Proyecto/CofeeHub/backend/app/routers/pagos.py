from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.deps import get_current_user, require_roles
from app.database import get_db
from app.models.estatus_ped import EstatusPed
from app.models.pagos import MetodoPago, Pago
from app.models.pedidos import Pedido
from app.schemas.pago import MetodoPagoOut, PagoCreate, PagoHistorialOut, PagoOut

router = APIRouter(prefix="/pagos", tags=["pagos"])


@router.get("/metodos", response_model=list[MetodoPagoOut], dependencies=[Depends(get_current_user)])
def listar_metodos_pago(db: Session = Depends(get_db)):
    return db.query(MetodoPago).all()


@router.get("", response_model=list[PagoHistorialOut], dependencies=[Depends(require_roles("cajero", "admin"))])
def listar_pagos(db: Session = Depends(get_db)):
    pagos = (
        db.query(Pago)
        .options(joinedload(Pago.pedido), joinedload(Pago.metodo))
        .order_by(Pago.fecha_pago.desc())
        .all()
    )
    return [
        PagoHistorialOut(
            id=p.id,
            id_pedido=p.id_pedido,
            folio=p.pedido.folio,
            id_mesa=p.pedido.id_mesa,
            metodo=p.metodo,
            monto=p.monto,
            monto_recibido=p.monto_recibido,
            cambio=p.cambio,
            fecha_pago=p.fecha_pago,
        )
        for p in pagos
    ]


@router.post("", response_model=PagoOut, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(require_roles("cajero", "admin"))])
def registrar_pago(datos: PagoCreate, db: Session = Depends(get_db)):
    pedido = db.query(Pedido).options(joinedload(Pedido.estatus_pedido)).filter(Pedido.id == datos.id_pedido).first()
    if not pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")

    if pedido.estatus_pedido.nombre != "listo":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                             detail="El pedido debe estar listo para poder cobrarse")

    metodo = db.query(MetodoPago).filter(MetodoPago.id == datos.id_metodo).first()
    if not metodo:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Metodo de pago no valido")

    cambio = None
    if datos.monto_recibido is not None:
        if datos.monto_recibido < pedido.total:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El monto recibido es insuficiente")
        cambio = datos.monto_recibido - pedido.total

    nuevo_pago = Pago(
        id_pedido=pedido.id,
        id_metodo=datos.id_metodo,
        monto=pedido.total,
        monto_recibido=datos.monto_recibido,
        cambio=cambio,
    )
    db.add(nuevo_pago)

    estatus_pagado = db.query(EstatusPed).filter(EstatusPed.nombre == "pagado").first()
    pedido.id_estatus_ped = estatus_pagado.id

    if pedido.mesa is not None:
        pedido.mesa.estatus = True

    db.commit()
    db.refresh(nuevo_pago)
    return nuevo_pago


@router.get("/{pedido_id}", response_model=PagoOut, dependencies=[Depends(get_current_user)])
def obtener_pago(pedido_id: int, db: Session = Depends(get_db)):
    pago = db.query(Pago).filter(Pago.id_pedido == pedido_id).first()
    if not pago:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Este pedido no tiene pago registrado")
    return pago
