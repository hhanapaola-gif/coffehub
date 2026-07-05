from flask import Blueprint, flash, redirect, render_template, request, url_for

from routes.auth import login_requerido
from services.api_client import ApiError, delete, get, post, put

bp = Blueprint("promociones", __name__, url_prefix="/promociones")


@bp.route("")
@login_requerido
def listar():
    promociones = get("/promociones")
    return render_template("promociones/list.html", promociones=promociones)


@bp.route("/nueva", methods=["GET", "POST"])
@login_requerido
def nueva():
    if request.method == "POST":
        datos = _armar_datos()
        try:
            post("/promociones", datos)
        except ApiError as e:
            flash(e.mensaje, "error")
            return render_template("promociones/form.html", promocion=None)

        flash("Promocion creada correctamente", "success")
        return redirect(url_for("promociones.listar"))

    return render_template("promociones/form.html", promocion=None)


@bp.route("/<int:promocion_id>/editar", methods=["GET", "POST"])
@login_requerido
def editar(promocion_id):
    if request.method == "POST":
        datos = _armar_datos()
        try:
            put(f"/promociones/{promocion_id}", datos)
        except ApiError as e:
            flash(e.mensaje, "error")
            return redirect(url_for("promociones.editar", promocion_id=promocion_id))

        flash("Promocion actualizada correctamente", "success")
        return redirect(url_for("promociones.listar"))

    promociones = get("/promociones")
    promocion = next((p for p in promociones if p["id"] == promocion_id), None)
    return render_template("promociones/form.html", promocion=promocion)


@bp.route("/<int:promocion_id>/eliminar", methods=["POST"])
@login_requerido
def eliminar(promocion_id):
    try:
        delete(f"/promociones/{promocion_id}")
        flash("Promocion eliminada", "success")
    except ApiError as e:
        flash(e.mensaje, "error")

    return redirect(url_for("promociones.listar"))


def _armar_datos():
    return {
        "nombre": request.form["nombre"],
        "descripcion": request.form.get("descripcion", ""),
        "descuento": float(request.form["descuento"]),
        "fecha_inicio": request.form["fecha_inicio"],
        "fecha_fin": request.form["fecha_fin"],
        "monto_minimo": float(request.form.get("monto_minimo") or 0),
        "estatus": request.form.get("estatus") == "on",
    }
