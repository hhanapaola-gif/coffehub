from flask import Blueprint, render_template, session

from routes.auth import login_requerido
from services.api_client import get

bp = Blueprint("dashboard", __name__)


@bp.route("/dashboard")
@login_requerido
def index():
    datos = get("/reportes/dashboard")
    return render_template("dashboard.html", datos=datos, nombre=session.get("nombre"))
