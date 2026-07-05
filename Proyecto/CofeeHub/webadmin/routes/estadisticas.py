from datetime import date, timedelta

from flask import Blueprint, render_template, request

from routes.auth import login_requerido
from services.api_client import get

bp = Blueprint("estadisticas", __name__, url_prefix="/estadisticas")


@bp.route("")
@login_requerido
def index():
    fecha_fin = request.args.get("fecha_fin") or date.today().isoformat()
    fecha_inicio = request.args.get("fecha_inicio") or (date.today() - timedelta(days=30)).isoformat()

    ventas = get("/reportes/ventas", params={"fecha_inicio": fecha_inicio, "fecha_fin": fecha_fin})
    gastos = get("/reportes/gastos", params={"fecha_inicio": fecha_inicio, "fecha_fin": fecha_fin})

    inicio_dt = date.fromisoformat(fecha_inicio)
    fin_dt = date.fromisoformat(fecha_fin)
    num_dias = max((fin_dt - inicio_dt).days + 1, 1)

    mapa_ventas = {f["fecha"]: float(f["total"]) for f in ventas["por_dia"]}
    mapa_gastos = {f["fecha"]: float(f["total"]) for f in gastos["por_dia"]}

    serie = []
    for i in range(num_dias):
        dia = (inicio_dt + timedelta(days=i)).isoformat()
        v = mapa_ventas.get(dia, 0)
        g = mapa_gastos.get(dia, 0)
        serie.append({"fecha": dia, "ventas": v, "gastos": g, "ganancia": v - g})

    ganancia_neta = float(ventas["total"]) - float(gastos["total"])

    return render_template(
        "estadisticas.html",
        ventas=ventas,
        gastos=gastos,
        serie=serie,
        ganancia_neta=ganancia_neta,
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin,
    )
