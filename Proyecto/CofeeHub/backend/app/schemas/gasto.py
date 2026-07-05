from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class CategoriaGastoOut(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True


class GastoCreate(BaseModel):
    descripcion: str
    monto: Decimal
    id_categoria_gast: int


class GastoOut(BaseModel):
    id: int
    descripcion: str
    monto: Decimal
    fecha_pago: datetime
    categoria: CategoriaGastoOut
    nombre_usuario: str

    class Config:
        from_attributes = True
