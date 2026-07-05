from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class DetallePedidoIn(BaseModel):
    id_producto: int
    cantidad: int
    observaciones: str | None = None


class PedidoCreate(BaseModel):
    id_mesa: int | None = None
    detalles: list[DetallePedidoIn]


class DetallePedidoOut(BaseModel):
    id: int
    id_producto: int
    nombre_producto: str
    cantidad: int
    observaciones: str | None
    subtotal: Decimal

    class Config:
        from_attributes = True


class PedidoOut(BaseModel):
    id: int
    folio: str
    fecha_hora: datetime
    estatus: str
    subtotal: Decimal
    descuento: Decimal
    total: Decimal
    id_mesa: int | None
    nombre_usuario: str
    nombre_promocion: str | None
    detalles: list[DetallePedidoOut]

    class Config:
        from_attributes = True


class CambiarEstatusIn(BaseModel):
    estatus: str
