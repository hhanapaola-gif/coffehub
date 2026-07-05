from flask import Blueprint, flash, redirect, render_template, request, url_for

from routes.auth import login_requerido
from services.api_client import ApiError, delete, get, post, put

bp = Blueprint("usuarios", __name__, url_prefix="/usuarios")


@bp.route("")
@login_requerido
def listar():
    usuarios = get("/usuarios")
    return render_template("usuarios/list.html", usuarios=usuarios)


@bp.route("/nuevo", methods=["GET", "POST"])
@login_requerido
def nuevo():
    roles = get("/roles")

    if request.method == "POST":
        datos = {
            "nombre": request.form["nombre"],
            "apellido_pat": request.form["apellido_pat"],
            "apellido_mat": request.form.get("apellido_mat", ""),
            "correo": request.form["correo"],
            "contrasena": request.form["contrasena"],
            "id_rol": int(request.form["id_rol"]),
            "estatus": request.form.get("estatus") == "on",
        }
        try:
            post("/usuarios", datos)
        except ApiError as e:
            flash(e.mensaje, "error")
            return render_template("usuarios/form.html", roles=roles, usuario=None)

        flash("Usuario creado correctamente", "success")
        return redirect(url_for("usuarios.listar"))

    return render_template("usuarios/form.html", roles=roles, usuario=None)


@bp.route("/<int:usuario_id>/editar", methods=["GET", "POST"])
@login_requerido
def editar(usuario_id):
    roles = get("/roles")

    if request.method == "POST":
        datos = {
            "nombre": request.form["nombre"],
            "apellido_pat": request.form["apellido_pat"],
            "apellido_mat": request.form.get("apellido_mat", ""),
            "correo": request.form["correo"],
            "id_rol": int(request.form["id_rol"]),
            "estatus": request.form.get("estatus") == "on",
        }
        if request.form.get("contrasena"):
            datos["contrasena"] = request.form["contrasena"]

        try:
            put(f"/usuarios/{usuario_id}", datos)
        except ApiError as e:
            flash(e.mensaje, "error")
            return redirect(url_for("usuarios.editar", usuario_id=usuario_id))

        flash("Usuario actualizado correctamente", "success")
        return redirect(url_for("usuarios.listar"))

    usuario = get(f"/usuarios/{usuario_id}")
    return render_template("usuarios/form.html", roles=roles, usuario=usuario)


@bp.route("/<int:usuario_id>/eliminar", methods=["POST"])
@login_requerido
def eliminar(usuario_id):
    try:
        delete(f"/usuarios/{usuario_id}")
        flash("Usuario eliminado", "success")
    except ApiError as e:
        flash(e.mensaje, "error")

    return redirect(url_for("usuarios.listar"))
