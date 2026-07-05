from decimal import Decimal

from pydantic import BaseModel


class IngredienteCreate(BaseModel):
    nombre: str
    stock_actual: Decimal = Decimal("0")
    stock_minimo: Decimal = Decimal("0")
    unidad_medida: str


class IngredienteUpdate(BaseModel):
    nombre: str | None = None
    stock_actual: Decimal | None = None
    stock_minimo: Decimal | None = None
    unidad_medida: str | None = None


class IngredienteOut(BaseModel):
    id: int
    nombre: str
    stock_actual: Decimal
    stock_minimo: Decimal
    unidad_medida: str
    alerta: bool

    class Config:
        from_attributes = True
