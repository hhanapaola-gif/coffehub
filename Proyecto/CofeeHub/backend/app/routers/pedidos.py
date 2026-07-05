from datetime import date
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.deps import get_current_user, require_roles
from app.database import get_db
from app.models.estatus_ped import EstatusPed
from app.models.ingredientes import ProdIngred
from app.models.mesas import Mesa
from app.models.pedidos import DetallePedido, Pedido
from app.models.productos import Producto
from app.models.promociones import Promocion
from app.models.usuarios import Usuario
from app.schemas.pedido import CambiarEstatusIn, PedidoCreate, PedidoOut

router = APIRouter(prefix="/pedidos", tags=["pedidos"])

ORDEN_ESTATUS = ["pendiente", "en_preparacion", "listo", "pagado", "cancelado"]

# no se pueden saltar pasos, afecta el cobro en caja
TRANSICIONES_PERMITIDAS = {
    "pendiente": {"en_preparacion"},
    "en_preparacion": {"listo"},
}


def serializar_pedido(pedido: Pedido) -> PedidoOut:
    return PedidoOut(
        id=pedido.id,
        folio=pedido.folio,
        fecha_hora=pedido.fecha_hora,
        estatus=pedido.estatus_pedido.nombre,
        subtotal=pedido.subtotal,
        descuento=pedido.descuento,
        total=pedido.total,
        id_mesa=pedido.id_mesa,
        nombre_usuario=pedido.usuario.nombre,
        nombre_promocion=pedido.promocion.nombre if pedido.promocion else None,
        detalles=[
            {
                "id": d.id,
                "id_producto": d.id_producto,
                "nombre_producto": d.producto.nombre,
                "cantidad": d.cantidad,
                "observaciones": d.observaciones,
                "subtotal": d.subtotal,
            }
            for d in pedido.detalles
        ],
    )


def cargar_pedido(pedido_id: int, db: Session) -> Pedido:
    pedido = (
        db.query(Pedido)
        .options(
            joinedload(Pedido.estatus_pedido),
            joinedload(Pedido.usuario),
            joinedload(Pedido.promocion),
            joinedload(Pedido.detalles).joinedload(DetallePedido.producto),
        )
        .filter(Pedido.id == pedido_id)
        .first()
    )
    if not pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")
    return pedido


@router.post("", response_model=PedidoOut, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(require_roles("mesero", "admin"))])
def crear_pedido(datos: PedidoCreate, db: Session = Depends(get_db), usuario: Usuario = Depends(get_current_user)):
    if not datos.detalles:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El pedido necesita al menos un producto")

    mesa = None
    if datos.id_mesa is not None:
        mesa = db.query(Mesa).filter(Mesa.id == datos.id_mesa).first()
        if not mesa:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mesa no valida")
        if not mesa.estatus:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Esa mesa esta ocupada")

    estatus_pendiente = db.query(EstatusPed).filter(EstatusPed.nombre == "pendiente").first()

    detalles_armados = []
    subtotal = Decimal("0")
    for item in datos.detalles:
        if item.cantidad < 1 or item.cantidad > 20:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                 detail="La cantidad por producto debe ser entre 1 y 20")

        producto = db.query(Producto).filter(Producto.id == item.id_producto).first()
        if not producto or not producto.estatus:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                 detail=f"Producto {item.id_producto} no disponible")

        subtotal_item = producto.precio * item.cantidad
        subtotal += subtotal_item
        detalles_armados.append((producto, item, subtotal_item))

    hoy = date.today()
    promo_aplicada = (
        db.query(Promocion)
        .filter(
            Promocion.estatus == True,
            Promocion.monto_minimo <= subtotal,
            Promocion.fecha_inicio <= hoy,
            Promocion.fecha_fin >= hoy,
        )
        .order_by(Promocion.descuento.desc())
        .first()
    )
    descuento = (subtotal * promo_aplicada.descuento / 100) if promo_aplicada else Decimal("0")
    total = subtotal - descuento

    nuevo_pedido = Pedido(
        folio="",
        id_estatus_ped=estatus_pendiente.id,
        subtotal=subtotal,
        descuento=descuento,
        total=total,
        id_mesa=datos.id_mesa,
        id_usuario=usuario.id,
        id_promocion=promo_aplicada.id if promo_aplicada else None,
    )
    db.add(nuevo_pedido)
    db.flush()

    nuevo_pedido.folio = str(1000 + nuevo_pedido.id)

    for producto, item, subtotal_item in detalles_armados:
        db.add(DetallePedido(
            id_pedido=nuevo_pedido.id,
            id_producto=producto.id,
            cantidad=item.cantidad,
            observaciones=item.observaciones,
            subtotal=subtotal_item,
        ))

    if mesa is not None:
        mesa.estatus = False

    db.commit()

    return serializar_pedido(cargar_pedido(nuevo_pedido.id, db))


@router.get("", response_model=list[PedidoOut], dependencies=[Depends(require_roles("admin"))])
def listar_pedidos(db: Session = Depends(get_db)):
    pedidos = (
        db.query(Pedido)
        .options(
            joinedload(Pedido.estatus_pedido),
            joinedload(Pedido.usuario),
            joinedload(Pedido.promocion),
            joinedload(Pedido.detalles).joinedload(DetallePedido.producto),
        )
        .order_by(Pedido.fecha_hora.desc())
        .all()
    )
    return [serializar_pedido(p) for p in pedidos]


@router.get("/activos", response_model=list[PedidoOut], dependencies=[Depends(require_roles("cocina", "admin"))])
def pedidos_activos(db: Session = Depends(get_db)):
    pedidos = (
        db.query(Pedido)
        .join(EstatusPed)
        .options(
            joinedload(Pedido.estatus_pedido),
            joinedload(Pedido.usuario),
            joinedload(Pedido.promocion),
            joinedload(Pedido.detalles).joinedload(DetallePedido.producto),
        )
        .filter(EstatusPed.nombre.in_(["pendiente", "en_preparacion"]))
        .order_by(Pedido.fecha_hora.asc())
        .all()
    )
    return [serializar_pedido(p) for p in pedidos]


@router.get("/listos", response_model=list[PedidoOut], dependencies=[Depends(require_roles("cajero", "admin"))])
def pedidos_listos_para_cobro(db: Session = Depends(get_db)):
    pedidos = (
        db.query(Pedido)
        .join(EstatusPed)
        .options(
            joinedload(Pedido.estatus_pedido),
            joinedload(Pedido.usuario),
            joinedload(Pedido.promocion),
            joinedload(Pedido.detalles).joinedload(DetallePedido.producto),
        )
        .filter(EstatusPed.nombre == "listo")
        .order_by(Pedido.fecha_hora.asc())
        .all()
    )
    return [serializar_pedido(p) for p in pedidos]


@router.get("/mios", response_model=list[PedidoOut], dependencies=[Depends(require_roles("mesero", "admin"))])
def mis_pedidos(db: Session = Depends(get_db), usuario: Usuario = Depends(get_current_user)):
    pedidos = (
        db.query(Pedido)
        .options(
            joinedload(Pedido.estatus_pedido),
            joinedload(Pedido.usuario),
            joinedload(Pedido.promocion),
            joinedload(Pedido.detalles).joinedload(DetallePedido.producto),
        )
        .filter(Pedido.id_usuario == usuario.id)
        .order_by(Pedido.fecha_hora.desc())
        .all()
    )
    return [serializar_pedido(p) for p in pedidos]


@router.get("/{pedido_id}", response_model=PedidoOut, dependencies=[Depends(get_current_user)])
def obtener_pedido(pedido_id: int, db: Session = Depends(get_db)):
    return serializar_pedido(cargar_pedido(pedido_id, db))


@router.put("/{pedido_id}/estatus", response_model=PedidoOut,
            dependencies=[Depends(require_roles("cocina", "admin"))])
def cambiar_estatus_pedido(pedido_id: int, datos: CambiarEstatusIn, db: Session = Depends(get_db)):
    if datos.estatus not in ORDEN_ESTATUS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Estatus no valido")

    pedido = cargar_pedido(pedido_id, db)
    estatus_actual = pedido.estatus_pedido.nombre

    siguientes_validos = TRANSICIONES_PERMITIDAS.get(estatus_actual, set())
    if datos.estatus not in siguientes_validos:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede cambiar el pedido de '{estatus_actual}' a '{datos.estatus}'",
        )

    if datos.estatus == "en_preparacion":
        consumo = {}
        ingredientes = {}
        for detalle in pedido.detalles:
            relaciones = db.query(ProdIngred).filter(ProdIngred.id_producto == detalle.id_producto).all()
            for rel in relaciones:
                requerido = rel.cantidad_usada * detalle.cantidad
                consumo[rel.id_ingrediente] = consumo.get(rel.id_ingrediente, 0) + requerido
                ingredientes[rel.id_ingrediente] = rel.ingrediente

        faltantes = [ing.nombre for ing_id, ing in ingredientes.items() if ing.stock_actual < consumo[ing_id]]
        if faltantes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Stock insuficiente de: {', '.join(faltantes)}",
            )

        for ing_id, cantidad in consumo.items():
            ingredientes[ing_id].stock_actual -= cantidad

    nuevo_estatus = db.query(EstatusPed).filter(EstatusPed.nombre == datos.estatus).first()
    pedido.id_estatus_ped = nuevo_estatus.id
    db.commit()

    return serializar_pedido(cargar_pedido(pedido_id, db))


@router.put("/{pedido_id}/cancelar", response_model=PedidoOut,
            dependencies=[Depends(require_roles("mesero", "admin"))])
def cancelar_pedido(pedido_id: int, db: Session = Depends(get_db)):
    pedido = cargar_pedido(pedido_id, db)

    if pedido.estatus_pedido.nombre != "pendiente":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                             detail="Solo se puede cancelar un pedido pendiente")

    estatus_cancelado = db.query(EstatusPed).filter(EstatusPed.nombre == "cancelado").first()
    pedido.id_estatus_ped = estatus_cancelado.id

    if pedido.mesa is not None:
        pedido.mesa.estatus = True

    db.commit()
    return serializar_pedido(cargar_pedido(pedido_id, db))
