from datetime import date, timedelta

from flask import Blueprint, render_template, request

from routes.auth import login_requerido
from services.api_client import get

bp = Blueprint("ventas", __name__, url_prefix="/ventas")


@bp.route("")
@login_requerido
def index():
    fecha_fin = request.args.get("fecha_fin") or date.today().isoformat()
    fecha_inicio = request.args.get("fecha_inicio") or (date.today() - timedelta(days=7)).isoformat()

    datos = get("/reportes/ventas", params={"fecha_inicio": fecha_inicio, "fecha_fin": fecha_fin})

    return render_template(
        "ventas.html",
        datos=datos,
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin,
    )
