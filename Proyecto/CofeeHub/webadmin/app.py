from flask import Flask, flash, redirect, render_template, session, url_for

from config import SECRET_KEY
from services.api_client import ApiError

app = Flask(__name__)
app.secret_key = SECRET_KEY


@app.errorhandler(ApiError)
def manejar_error_api(error):
    if error.status_code == 401:
        session.clear()
        flash("Tu sesion expiro, vuelve a iniciar sesion", "error")
        return redirect(url_for("auth.login"))

    flash(error.mensaje, "error")
    return render_template("error.html", mensaje=error.mensaje), error.status_code


from routes.auth import bp as auth_bp
from routes.dashboard import bp as dashboard_bp
from routes.usuarios import bp as usuarios_bp
from routes.menu import bp as menu_bp
from routes.inventario import bp as inventario_bp
from routes.ventas import bp as ventas_bp
from routes.estadisticas import bp as estadisticas_bp
from routes.reportes import bp as reportes_bp
from routes.promociones import bp as promociones_bp
from routes.gastos import bp as gastos_bp

app.register_blueprint(auth_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(usuarios_bp)
app.register_blueprint(menu_bp)
app.register_blueprint(inventario_bp)
app.register_blueprint(ventas_bp)
app.register_blueprint(estadisticas_bp)
app.register_blueprint(reportes_bp)
app.register_blueprint(promociones_bp)
app.register_blueprint(gastos_bp)


@app.route("/")
def home():
    if session.get("access_token"):
        return redirect(url_for("dashboard.index"))
    return redirect(url_for("auth.login"))


if __name__ == "__main__":
    app.run(debug=True, port=5000)
