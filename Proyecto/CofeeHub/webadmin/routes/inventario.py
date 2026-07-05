from flask import Blueprint, flash, redirect, render_template, request, url_for

from routes.auth import login_requerido
from services.api_client import ApiError, delete, get, post, put

bp = Blueprint("inventario", __name__, url_prefix="/inventario")


@bp.route("")
@login_requerido
def listar():
    ingredientes = get("/inventario")
    return render_template("inventario/list.html", ingredientes=ingredientes)


@bp.route("/nuevo", methods=["GET", "POST"])
@login_requerido
def nuevo():
    if request.method == "POST":
        datos = {
            "nombre": request.form["nombre"],
            "stock_actual": float(request.form["stock_actual"]),
            "stock_minimo": float(request.form["stock_minimo"]),
            "unidad_medida": request.form["unidad_medida"],
        }
        try:
            post("/inventario", datos)
        except ApiError as e:
            flash(e.mensaje, "error")
            return render_template("inventario/form.html", ingrediente=None)

        flash("Ingrediente creado correctamente", "success")
        return redirect(url_for("inventario.listar"))

    return render_template("inventario/form.html", ingrediente=None)


@bp.route("/<int:ingrediente_id>/editar", methods=["GET", "POST"])
@login_requerido
def editar(ingrediente_id):
    if request.method == "POST":
        datos = {
            "nombre": request.form["nombre"],
            "stock_actual": float(request.form["stock_actual"]),
            "stock_minimo": float(request.form["stock_minimo"]),
            "unidad_medida": request.form["unidad_medida"],
        }
        try:
            put(f"/inventario/{ingrediente_id}", datos)
        except ApiError as e:
            flash(e.mensaje, "error")
            return redirect(url_for("inventario.editar", ingrediente_id=ingrediente_id))

        flash("Ingrediente actualizado correctamente", "success")
        return redirect(url_for("inventario.listar"))

    ingredientes = get("/inventario")
    ingrediente = next((i for i in ingredientes if i["id"] == ingrediente_id), None)
    return render_template("inventario/form.html", ingrediente=ingrediente)


@bp.route("/<int:ingrediente_id>/eliminar", methods=["POST"])
@login_requerido
def eliminar(ingrediente_id):
    try:
        delete(f"/inventario/{ingrediente_id}")
        flash("Ingrediente eliminado", "success")
    except ApiError as e:
        flash(e.mensaje, "error")

    return redirect(url_for("inventario.listar"))
