from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_roles
from app.database import get_db
from app.models.promociones import Promocion
from app.schemas.promocion import PromocionCreate, PromocionOut, PromocionUpdate

router = APIRouter(prefix="/promociones", tags=["promociones"])


@router.get("", response_model=list[PromocionOut], dependencies=[Depends(get_current_user)])
def listar_promociones(db: Session = Depends(get_db)):
    return db.query(Promocion).all()


@router.get("/activas", response_model=list[PromocionOut], dependencies=[Depends(get_current_user)])
def listar_promociones_activas(db: Session = Depends(get_db)):
    hoy = date.today()
    return (
        db.query(Promocion)
        .filter(Promocion.estatus == True, Promocion.fecha_inicio <= hoy, Promocion.fecha_fin >= hoy)
        .all()
    )


@router.post("", response_model=PromocionOut, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(require_roles("admin"))])
def crear_promocion(datos: PromocionCreate, db: Session = Depends(get_db)):
    nueva = Promocion(**datos.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@router.put("/{promocion_id}", response_model=PromocionOut, dependencies=[Depends(require_roles("admin"))])
def editar_promocion(promocion_id: int, datos: PromocionUpdate, db: Session = Depends(get_db)):
    promocion = db.query(Promocion).filter(Promocion.id == promocion_id).first()
    if not promocion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Promocion no encontrada")

    for campo, valor in datos.model_dump(exclude_unset=True).items():
        setattr(promocion, campo, valor)

    db.commit()
    db.refresh(promocion)
    return promocion


@router.delete("/{promocion_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(require_roles("admin"))])
def eliminar_promocion(promocion_id: int, db: Session = Depends(get_db)):
    promocion = db.query(Promocion).filter(Promocion.id == promocion_id).first()
    if not promocion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Promocion no encontrada")

    db.delete(promocion)
    db.commit()
