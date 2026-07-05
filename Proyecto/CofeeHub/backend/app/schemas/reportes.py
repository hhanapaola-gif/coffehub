from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel


class VentaPorDia(BaseModel):
    fecha: date
    total: Decimal


class PedidosPorEstado(BaseModel):
    estatus: str
    cantidad: int


class DashboardOut(BaseModel):
    ventas_hoy: Decimal
    pedidos_activos: int
    ganancias_hoy: Decimal
    gastos_hoy: Decimal
    ventas_ultimos_7_dias: list[VentaPorDia]
    pedidos_por_estado: list[PedidosPorEstado]
    ingredientes_con_alerta: int
    pedidos_listos_para_cobro: int


class ProductoVendido(BaseModel):
    producto: str
    cantidad: int
    total: Decimal


class ReporteVentasOut(BaseModel):
    total: Decimal
    por_dia: list[VentaPorDia]
    productos_mas_vendidos: list[ProductoVendido]
    productos_menos_vendidos: list[ProductoVendido]


class GastoPorCategoria(BaseModel):
    categoria: str
    total: Decimal


class GastoPorDia(BaseModel):
    fecha: date
    total: Decimal


class ReporteGastosOut(BaseModel):
    total: Decimal
    por_dia: list[GastoPorDia]
    por_categoria: list[GastoPorCategoria]


class PedidoReporte(BaseModel):
    folio: str
    fecha_hora: datetime
    id_mesa: int | None
    nombre_usuario: str
    estatus: str
    total: Decimal


class ReportePedidosOut(BaseModel):
    total_pedidos: int
    pedidos: list[PedidoReporte]
