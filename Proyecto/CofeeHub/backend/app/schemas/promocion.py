from datetime import date
from decimal import Decimal

from pydantic import BaseModel


class PromocionOut(BaseModel):
    id: int
    nombre: str
    descripcion: str | None
    descuento: Decimal
    fecha_inicio: date
    fecha_fin: date
    estatus: bool
    monto_minimo: Decimal

    class Config:
        from_attributes = True


class PromocionCreate(BaseModel):
    nombre: str
    descripcion: str | None = None
    descuento: Decimal
    fecha_inicio: date
    fecha_fin: date
    estatus: bool = True
    monto_minimo: Decimal = Decimal("0")


class PromocionUpdate(BaseModel):
    nombre: str | None = None
    descripcion: str | None = None
    descuento: Decimal | None = None
    fecha_inicio: date | None = None
    fecha_fin: date | None = None
    estatus: bool | None = None
    monto_minimo: Decimal | None = None
