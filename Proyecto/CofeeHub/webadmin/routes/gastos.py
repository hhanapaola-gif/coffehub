from flask import Blueprint, flash, redirect, render_template, request, url_for

from routes.auth import login_requerido
from services.api_client import ApiError, get, post

bp = Blueprint("gastos", __name__, url_prefix="/gastos")


@bp.route("")
@login_requerido
def listar():
    gastos = get("/gastos")
    categorias = get("/gastos/categorias")
    return render_template("gastos.html", gastos=gastos, categorias=categorias)


@bp.route("/nuevo", methods=["POST"])
@login_requerido
def nuevo():
    datos = {
        "descripcion": request.form["descripcion"],
        "monto": float(request.form["monto"]),
        "id_categoria_gast": int(request.form["id_categoria_gast"]),
    }
    try:
        post("/gastos", datos)
        flash("Gasto registrado correctamente", "success")
    except ApiError as e:
        flash(e.mensaje, "error")

    return redirect(url_for("gastos.listar"))
