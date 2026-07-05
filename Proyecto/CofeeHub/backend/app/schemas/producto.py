from decimal import Decimal

from pydantic import BaseModel


class CategoriaOut(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True


class CategoriaCreate(BaseModel):
    nombre: str


class IngredienteProductoIn(BaseModel):
    id_ingrediente: int
    cantidad_usada: Decimal


class IngredienteProductoOut(BaseModel):
    id_ingrediente: int
    nombre: str
    cantidad_usada: Decimal
    unidad_medida: str

    class Config:
        from_attributes = True


class ProductoCreate(BaseModel):
    nombre: str
    descripcion: str | None = None
    precio: Decimal
    id_categoria_prod: int
    estatus: bool = True
    ingredientes: list[IngredienteProductoIn] = []


class ProductoUpdate(BaseModel):
    nombre: str | None = None
    descripcion: str | None = None
    precio: Decimal | None = None
    id_categoria_prod: int | None = None
    estatus: bool | None = None
    ingredientes: list[IngredienteProductoIn] | None = None


class ProductoOut(BaseModel):
    id: int
    nombre: str
    descripcion: str | None
    precio: Decimal
    estatus: bool
    categoria: CategoriaOut

    class Config:
        from_attributes = True


class ProductoDetalleOut(ProductoOut):
    ingredientes: list[IngredienteProductoOut] = []
