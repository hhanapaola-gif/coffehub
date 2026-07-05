from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.deps import get_current_user, require_roles
from app.database import get_db
from app.models.ingredientes import Ingrediente, ProdIngred
from app.models.productos import CategoriaProd, Producto
from app.schemas.producto import (
    CategoriaCreate,
    CategoriaOut,
    ProductoCreate,
    ProductoDetalleOut,
    ProductoOut,
    ProductoUpdate,
)

router = APIRouter(prefix="/menu", tags=["menu"])

puede_editar_menu = require_roles("admin", "cocina")


@router.get("/categorias", response_model=list[CategoriaOut], dependencies=[Depends(get_current_user)])
def listar_categorias(db: Session = Depends(get_db)):
    return db.query(CategoriaProd).all()


@router.post("/categorias", response_model=CategoriaOut, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(puede_editar_menu)])
def crear_categoria(datos: CategoriaCreate, db: Session = Depends(get_db)):
    nueva = CategoriaProd(nombre=datos.nombre)
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@router.get("/productos", response_model=list[ProductoOut], dependencies=[Depends(get_current_user)])
def listar_productos(db: Session = Depends(get_db)):
    return db.query(Producto).options(joinedload(Producto.categoria)).all()


@router.get("/productos/{producto_id}", response_model=ProductoDetalleOut, dependencies=[Depends(get_current_user)])
def obtener_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = (
        db.query(Producto)
        .options(joinedload(Producto.categoria), joinedload(Producto.ingredientes).joinedload(ProdIngred.ingrediente))
        .filter(Producto.id == producto_id)
        .first()
    )
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")

    return ProductoDetalleOut(
        id=producto.id,
        nombre=producto.nombre,
        descripcion=producto.descripcion,
        precio=producto.precio,
        estatus=producto.estatus,
        categoria=producto.categoria,
        ingredientes=[
            {
                "id_ingrediente": pi.id_ingrediente,
                "nombre": pi.ingrediente.nombre,
                "cantidad_usada": pi.cantidad_usada,
                "unidad_medida": pi.ingrediente.unidad_medida,
            }
            for pi in producto.ingredientes
        ],
    )


@router.post("/productos", response_model=ProductoOut, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(puede_editar_menu)])
def crear_producto(datos: ProductoCreate, db: Session = Depends(get_db)):
    categoria = db.query(CategoriaProd).filter(CategoriaProd.id == datos.id_categoria_prod).first()
    if not categoria:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Categoria no valida")

    nuevo = Producto(
        nombre=datos.nombre,
        descripcion=datos.descripcion,
        precio=datos.precio,
        id_categoria_prod=datos.id_categoria_prod,
        estatus=datos.estatus,
    )
    db.add(nuevo)
    db.flush()

    for ing in datos.ingredientes:
        db.add(ProdIngred(id_producto=nuevo.id, id_ingrediente=ing.id_ingrediente, cantidad_usada=ing.cantidad_usada))

    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.put("/productos/{producto_id}", response_model=ProductoOut, dependencies=[Depends(puede_editar_menu)])
def editar_producto(producto_id: int, datos: ProductoUpdate, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")

    datos_dict = datos.model_dump(exclude_unset=True, exclude={"ingredientes"})
    for campo, valor in datos_dict.items():
        setattr(producto, campo, valor)

    if datos.ingredientes is not None:
        db.query(ProdIngred).filter(ProdIngred.id_producto == producto_id).delete()
        for ing in datos.ingredientes:
            db.add(ProdIngred(id_producto=producto_id, id_ingrediente=ing.id_ingrediente,
                               cantidad_usada=ing.cantidad_usada))

    db.commit()
    db.refresh(producto)
    return producto


@router.delete("/productos/{producto_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(puede_editar_menu)])
def eliminar_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")

    db.delete(producto)
    db.commit()
