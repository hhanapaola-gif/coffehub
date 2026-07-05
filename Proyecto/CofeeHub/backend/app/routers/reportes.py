from datetime import date, timedelta
from decimal import Decimal

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.core.deps import require_roles
from app.database import get_db
from app.models.estatus_ped import EstatusPed
from app.models.gastos import CategoriaGasto, Gasto
from app.models.ingredientes import Ingrediente
from app.models.pagos import Pago
from app.models.pedidos import DetallePedido, Pedido
from app.models.productos import Producto
from app.schemas.reportes import DashboardOut, ReporteGastosOut, ReportePedidosOut, ReporteVentasOut

router = APIRouter(prefix="/reportes", tags=["reportes"], dependencies=[Depends(require_roles("admin"))])


@router.get("/dashboard", response_model=DashboardOut)
def dashboard(db: Session = Depends(get_db)):
    hoy = date.today()

    ventas_hoy = (
        db.query(func.coalesce(func.sum(Pago.monto), 0))
        .filter(func.date(Pago.fecha_pago) == hoy)
        .scalar()
    )
    gastos_hoy = (
        db.query(func.coalesce(func.sum(Gasto.monto), 0))
        .filter(func.date(Gasto.fecha_pago) == hoy)
        .scalar()
    )

    pedidos_activos = (
        db.query(func.count(Pedido.id))
        .join(EstatusPed)
        .filter(EstatusPed.nombre.in_(["pendiente", "en_preparacion", "listo"]))
        .scalar()
    )

    pedidos_listos = (
        db.query(func.count(Pedido.id)).join(EstatusPed).filter(EstatusPed.nombre == "listo").scalar()
    )

    ingredientes_alerta = sum(1 for i in db.query(Ingrediente).all() if i.alerta)

    desde = hoy - timedelta(days=6)
    filas_ventas = (
        db.query(func.date(Pago.fecha_pago).label("fecha"), func.sum(Pago.monto).label("total"))
        .filter(func.date(Pago.fecha_pago) >= desde)
        .group_by(func.date(Pago.fecha_pago))
        .all()
    )
    mapa_ventas = {f.fecha: f.total for f in filas_ventas}
    ventas_7_dias = [
        {"fecha": desde + timedelta(days=i), "total": mapa_ventas.get(desde + timedelta(days=i), Decimal("0"))}
        for i in range(7)
    ]

    filas_estado = (
        db.query(EstatusPed.nombre.label("estatus"), func.count(Pedido.id).label("cantidad"))
        .join(Pedido, Pedido.id_estatus_ped == EstatusPed.id)
        .group_by(EstatusPed.nombre)
        .all()
    )

    return DashboardOut(
        ventas_hoy=ventas_hoy,
        pedidos_activos=pedidos_activos,
        ganancias_hoy=ventas_hoy - gastos_hoy,
        gastos_hoy=gastos_hoy,
        ventas_ultimos_7_dias=ventas_7_dias,
        pedidos_por_estado=[{"estatus": f.estatus, "cantidad": f.cantidad} for f in filas_estado],
        ingredientes_con_alerta=ingredientes_alerta,
        pedidos_listos_para_cobro=pedidos_listos,
    )


@router.get("/ventas", response_model=ReporteVentasOut)
def reporte_ventas(
    fecha_inicio: date = Query(...),
    fecha_fin: date = Query(...),
    db: Session = Depends(get_db),
):
    total = (
        db.query(func.coalesce(func.sum(Pago.monto), 0))
        .filter(func.date(Pago.fecha_pago) >= fecha_inicio, func.date(Pago.fecha_pago) <= fecha_fin)
        .scalar()
    )

    filas_dia = (
        db.query(func.date(Pago.fecha_pago).label("fecha"), func.sum(Pago.monto).label("total"))
        .filter(func.date(Pago.fecha_pago) >= fecha_inicio, func.date(Pago.fecha_pago) <= fecha_fin)
        .group_by(func.date(Pago.fecha_pago))
        .order_by(func.date(Pago.fecha_pago))
        .all()
    )

    filas_productos = (
        db.query(
            Producto.nombre.label("producto"),
            func.sum(DetallePedido.cantidad).label("cantidad"),
            func.sum(DetallePedido.subtotal).label("total"),
        )
        .join(DetallePedido, DetallePedido.id_producto == Producto.id)
        .join(Pedido, Pedido.id == DetallePedido.id_pedido)
        .join(Pago, Pago.id_pedido == Pedido.id)
        .filter(func.date(Pago.fecha_pago) >= fecha_inicio, func.date(Pago.fecha_pago) <= fecha_fin)
        .group_by(Producto.nombre)
        .all()
    )

    mas_vendidos = sorted(filas_productos, key=lambda f: f.cantidad, reverse=True)[:5]
    menos_vendidos = sorted(filas_productos, key=lambda f: f.cantidad)[:5]

    return ReporteVentasOut(
        total=total,
        por_dia=[{"fecha": f.fecha, "total": f.total} for f in filas_dia],
        productos_mas_vendidos=[{"producto": f.producto, "cantidad": f.cantidad, "total": f.total} for f in mas_vendidos],
        productos_menos_vendidos=[{"producto": f.producto, "cantidad": f.cantidad, "total": f.total} for f in menos_vendidos],
    )


@router.get("/gastos", response_model=ReporteGastosOut)
def reporte_gastos(
    fecha_inicio: date = Query(...),
    fecha_fin: date = Query(...),
    db: Session = Depends(get_db),
):
    total = (
        db.query(func.coalesce(func.sum(Gasto.monto), 0))
        .filter(func.date(Gasto.fecha_pago) >= fecha_inicio, func.date(Gasto.fecha_pago) <= fecha_fin)
        .scalar()
    )

    filas_categoria = (
        db.query(CategoriaGasto.nombre.label("categoria"), func.sum(Gasto.monto).label("total"))
        .join(Gasto, Gasto.id_categoria_gast == CategoriaGasto.id)
        .filter(func.date(Gasto.fecha_pago) >= fecha_inicio, func.date(Gasto.fecha_pago) <= fecha_fin)
        .group_by(CategoriaGasto.nombre)
        .all()
    )

    filas_dia = (
        db.query(func.date(Gasto.fecha_pago).label("fecha"), func.sum(Gasto.monto).label("total"))
        .filter(func.date(Gasto.fecha_pago) >= fecha_inicio, func.date(Gasto.fecha_pago) <= fecha_fin)
        .group_by(func.date(Gasto.fecha_pago))
        .order_by(func.date(Gasto.fecha_pago))
        .all()
    )

    return ReporteGastosOut(
        total=total,
        por_dia=[{"fecha": f.fecha, "total": f.total} for f in filas_dia],
        por_categoria=[{"categoria": f.categoria, "total": f.total} for f in filas_categoria],
    )


@router.get("/pedidos", response_model=ReportePedidosOut)
def reporte_pedidos(
    fecha_inicio: date = Query(...),
    fecha_fin: date = Query(...),
    db: Session = Depends(get_db),
):
    pedidos = (
        db.query(Pedido)
        .options(joinedload(Pedido.estatus_pedido), joinedload(Pedido.usuario))
        .filter(func.date(Pedido.fecha_hora) >= fecha_inicio, func.date(Pedido.fecha_hora) <= fecha_fin)
        .order_by(Pedido.fecha_hora.desc())
        .all()
    )

    items = [
        {
            "folio": p.folio,
            "fecha_hora": p.fecha_hora,
            "id_mesa": p.id_mesa,
            "nombre_usuario": p.usuario.nombre,
            "estatus": p.estatus_pedido.nombre,
            "total": p.total,
        }
        for p in pedidos
    ]

    return ReportePedidosOut(total_pedidos=len(items), pedidos=items)
