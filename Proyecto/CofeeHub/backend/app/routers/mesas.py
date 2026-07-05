from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_roles
from app.database import get_db
from app.models.mesas import Mesa
from app.schemas.mesa import MesaCreate, MesaOut, MesaUpdate

router = APIRouter(prefix="/mesas", tags=["mesas"])


@router.get("", response_model=list[MesaOut], dependencies=[Depends(get_current_user)])
def listar_mesas(db: Session = Depends(get_db)):
    return db.query(Mesa).order_by(Mesa.id).all()


@router.post("", response_model=MesaOut, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(require_roles("admin"))])
def crear_mesa(datos: MesaCreate, db: Session = Depends(get_db)):
    nueva = Mesa(**datos.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@router.put("/{mesa_id}", response_model=MesaOut, dependencies=[Depends(require_roles("admin"))])
def editar_mesa(mesa_id: int, datos: MesaUpdate, db: Session = Depends(get_db)):
    mesa = db.query(Mesa).filter(Mesa.id == mesa_id).first()
    if not mesa:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mesa no encontrada")

    for campo, valor in datos.model_dump(exclude_unset=True).items():
        setattr(mesa, campo, valor)

    db.commit()
    db.refresh(mesa)
    return mesa


@router.delete("/{mesa_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_roles("admin"))])
def eliminar_mesa(mesa_id: int, db: Session = Depends(get_db)):
    mesa = db.query(Mesa).filter(Mesa.id == mesa_id).first()
    if not mesa:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mesa no encontrada")

    db.delete(mesa)
    db.commit()
