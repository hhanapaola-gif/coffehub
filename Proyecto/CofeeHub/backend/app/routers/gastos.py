from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from app.core.deps import get_current_user, require_roles
from app.database import get_db
from app.models.gastos import CategoriaGasto, Gasto
from app.models.usuarios import Usuario
from app.schemas.gasto import CategoriaGastoOut, GastoCreate, GastoOut

router = APIRouter(prefix="/gastos", tags=["gastos"])


def serializar_gasto(gasto: Gasto) -> GastoOut:
    return GastoOut(
        id=gasto.id,
        descripcion=gasto.descripcion,
        monto=gasto.monto,
        fecha_pago=gasto.fecha_pago,
        categoria=gasto.categoria,
        nombre_usuario=gasto.usuario.nombre,
    )


@router.get("/categorias", response_model=list[CategoriaGastoOut], dependencies=[Depends(get_current_user)])
def listar_categorias_gasto(db: Session = Depends(get_db)):
    return db.query(CategoriaGasto).all()


@router.get("", response_model=list[GastoOut], dependencies=[Depends(require_roles("cajero", "admin"))])
def listar_gastos(db: Session = Depends(get_db)):
    gastos = (
        db.query(Gasto)
        .options(joinedload(Gasto.categoria), joinedload(Gasto.usuario))
        .order_by(Gasto.fecha_pago.desc())
        .all()
    )
    return [serializar_gasto(g) for g in gastos]


@router.post("", response_model=GastoOut, status_code=201, dependencies=[Depends(require_roles("cajero", "admin"))])
def registrar_gasto(datos: GastoCreate, db: Session = Depends(get_db), usuario: Usuario = Depends(get_current_user)):
    nuevo = Gasto(
        descripcion=datos.descripcion,
        monto=datos.monto,
        id_categoria_gast=datos.id_categoria_gast,
        id_usuario=usuario.id,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return serializar_gasto(nuevo)
