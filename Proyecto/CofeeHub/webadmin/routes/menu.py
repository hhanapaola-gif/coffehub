from flask import Blueprint, flash, redirect, render_template, request, url_for

from routes.auth import login_requerido
from services.api_client import ApiError, delete, get, post, put

bp = Blueprint("menu", __name__, url_prefix="/menu")


@bp.route("")
@login_requerido
def listar():
    productos = get("/menu/productos")
    return render_template("menu/list.html", productos=productos)


@bp.route("/nuevo", methods=["GET", "POST"])
@login_requerido
def nuevo():
    categorias = get("/menu/categorias")
    ingredientes = get("/inventario")

    if request.method == "POST":
        datos = _armar_datos_formulario()
        try:
            post("/menu/productos", datos)
        except ApiError as e:
            flash(e.mensaje, "error")
            return render_template("menu/form.html", categorias=categorias, ingredientes=ingredientes, producto=None)

        flash("Producto creado correctamente", "success")
        return redirect(url_for("menu.listar"))

    return render_template("menu/form.html", categorias=categorias, ingredientes=ingredientes, producto=None)


@bp.route("/<int:producto_id>/editar", methods=["GET", "POST"])
@login_requerido
def editar(producto_id):
    categorias = get("/menu/categorias")
    ingredientes = get("/inventario")

    if request.method == "POST":
        datos = _armar_datos_formulario()
        try:
            put(f"/menu/productos/{producto_id}", datos)
        except ApiError as e:
            flash(e.mensaje, "error")
            return redirect(url_for("menu.editar", producto_id=producto_id))

        flash("Producto actualizado correctamente", "success")
        return redirect(url_for("menu.listar"))

    producto = get(f"/menu/productos/{producto_id}")
    return render_template("menu/form.html", categorias=categorias, ingredientes=ingredientes, producto=producto)


@bp.route("/<int:producto_id>/eliminar", methods=["POST"])
@login_requerido
def eliminar(producto_id):
    try:
        delete(f"/menu/productos/{producto_id}")
        flash("Producto eliminado", "success")
    except ApiError as e:
        flash(e.mensaje, "error")

    return redirect(url_for("menu.listar"))


@bp.route("/categorias/nueva", methods=["POST"])
@login_requerido
def nueva_categoria():
    try:
        post("/menu/categorias", {"nombre": request.form["nombre"]})
        flash("Categoria creada", "success")
    except ApiError as e:
        flash(e.mensaje, "error")

    return redirect(request.referrer or url_for("menu.listar"))


def _armar_datos_formulario():
    ids_ingrediente = request.form.getlist("id_ingrediente")
    cantidades = request.form.getlist("cantidad_usada")

    ingredientes = [
        {"id_ingrediente": int(i), "cantidad_usada": float(c)}
        for i, c in zip(ids_ingrediente, cantidades) if i and c
    ]

    return {
        "nombre": request.form["nombre"],
        "descripcion": request.form.get("descripcion", ""),
        "precio": float(request.form["precio"]),
        "id_categoria_prod": int(request.form["id_categoria_prod"]),
        "estatus": request.form.get("estatus") == "on",
        "ingredientes": ingredientes,
    }
