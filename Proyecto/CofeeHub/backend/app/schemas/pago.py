from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class PagoCreate(BaseModel):
    id_pedido: int
    id_metodo: int
    monto_recibido: Decimal | None = None


class MetodoPagoOut(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True


class PagoOut(BaseModel):
    id: int
    id_pedido: int
    metodo: MetodoPagoOut
    monto: Decimal
    monto_recibido: Decimal | None
    cambio: Decimal | None
    fecha_pago: datetime

    class Config:
        from_attributes = True


class PagoHistorialOut(BaseModel):
    id: int
    id_pedido: int
    folio: str
    id_mesa: int | None
    metodo: MetodoPagoOut
    monto: Decimal
    monto_recibido: Decimal | None
    cambio: Decimal | None
    fecha_pago: datetime

    class Config:
        from_attributes = True
