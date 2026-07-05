from functools import wraps

from flask import Blueprint, flash, redirect, render_template, request, session, url_for

from services.api_client import ApiError, login as api_login

bp = Blueprint("auth", __name__)


def login_requerido(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if not session.get("access_token"):
            return redirect(url_for("auth.login"))
        return func(*args, **kwargs)

    return wrapper


@bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        correo = request.form.get("correo", "").strip()
        contrasena = request.form.get("contrasena", "")

        try:
            datos = api_login(correo, contrasena)
        except ApiError as e:
            flash(e.mensaje, "error")
            return render_template("login.html")

        if datos["rol"] != "admin":
            flash("Esta plataforma es solo para administradores", "error")
            return render_template("login.html")

        session["access_token"] = datos["access_token"]
        session["refresh_token"] = datos["refresh_token"]
        session["nombre"] = datos["nombre"]
        session["rol"] = datos["rol"]

        return redirect(url_for("dashboard.index"))

    return render_template("login.html")


@bp.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("auth.login"))
