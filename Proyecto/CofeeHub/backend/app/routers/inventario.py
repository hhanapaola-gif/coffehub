from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_roles
from app.database import get_db
from app.models.ingredientes import Ingrediente
from app.schemas.ingrediente import IngredienteCreate, IngredienteOut, IngredienteUpdate

router = APIRouter(prefix="/inventario", tags=["inventario"])

puede_editar_inventario = require_roles("admin", "cocina")


@router.get("", response_model=list[IngredienteOut], dependencies=[Depends(get_current_user)])
def listar_ingredientes(db: Session = Depends(get_db)):
    return db.query(Ingrediente).all()


@router.get("/alertas", response_model=list[IngredienteOut], dependencies=[Depends(get_current_user)])
def alertas_stock(db: Session = Depends(get_db)):
    ingredientes = db.query(Ingrediente).all()
    return [i for i in ingredientes if i.alerta]


@router.post("", response_model=IngredienteOut, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(puede_editar_inventario)])
def crear_ingrediente(datos: IngredienteCreate, db: Session = Depends(get_db)):
    nuevo = Ingrediente(**datos.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.put("/{ingrediente_id}", response_model=IngredienteOut, dependencies=[Depends(puede_editar_inventario)])
def editar_ingrediente(ingrediente_id: int, datos: IngredienteUpdate, db: Session = Depends(get_db)):
    ingrediente = db.query(Ingrediente).filter(Ingrediente.id == ingrediente_id).first()
    if not ingrediente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingrediente no encontrado")

    for campo, valor in datos.model_dump(exclude_unset=True).items():
        setattr(ingrediente, campo, valor)

    db.commit()
    db.refresh(ingrediente)
    return ingrediente


@router.delete("/{ingrediente_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(puede_editar_inventario)])
def eliminar_ingrediente(ingrediente_id: int, db: Session = Depends(get_db)):
    ingrediente = db.query(Ingrediente).filter(Ingrediente.id == ingrediente_id).first()
    if not ingrediente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingrediente no encontrado")

    db.delete(ingrediente)
    db.commit()
