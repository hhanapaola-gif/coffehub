import io
from datetime import date, timedelta

from flask import Blueprint, render_template, request, send_file
from openpyxl import Workbook
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet

from routes.auth import login_requerido
from services.api_client import get

bp = Blueprint("reportes", __name__, url_prefix="/reportes")


@bp.route("")
@login_requerido
def index():
    fecha_fin = request.args.get("fecha_fin") or date.today().isoformat()
    fecha_inicio = request.args.get("fecha_inicio") or (date.today() - timedelta(days=30)).isoformat()
    return render_template("reportes.html", fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)


def _filas_reporte(tipo, fecha_inicio, fecha_fin):
    if tipo == "ventas":
        datos = get("/reportes/ventas", params={"fecha_inicio": fecha_inicio, "fecha_fin": fecha_fin})
        encabezados = ["Fecha", "Total"]
        filas = [[f["fecha"], f["total"]] for f in datos["por_dia"]]
        filas.append(["TOTAL", datos["total"]])
        return "Reporte de ventas", encabezados, filas

    if tipo == "gastos":
        datos = get("/reportes/gastos", params={"fecha_inicio": fecha_inicio, "fecha_fin": fecha_fin})
        encabezados = ["Categoria", "Total"]
        filas = [[f["categoria"], f["total"]] for f in datos["por_categoria"]]
        filas.append(["TOTAL", datos["total"]])
        return "Reporte de gastos", encabezados, filas

    if tipo == "ganancias":
        ventas = get("/reportes/ventas", params={"fecha_inicio": fecha_inicio, "fecha_fin": fecha_fin})
        gastos = get("/reportes/gastos", params={"fecha_inicio": fecha_inicio, "fecha_fin": fecha_fin})
        encabezados = ["Concepto", "Monto"]
        ganancia = float(ventas["total"]) - float(gastos["total"])
        filas = [
            ["Ingresos (ventas)", ventas["total"]],
            ["Egresos (gastos)", gastos["total"]],
            ["Ganancia neta", ganancia],
        ]
        return "Reporte de ganancias", encabezados, filas

    if tipo == "productos_mas":
        datos = get("/reportes/ventas", params={"fecha_inicio": fecha_inicio, "fecha_fin": fecha_fin})
        encabezados = ["Producto", "Cantidad vendida", "Total"]
        filas = [[f["producto"], f["cantidad"], f["total"]] for f in datos["productos_mas_vendidos"]]
        return "Productos mas vendidos", encabezados, filas

    if tipo == "productos_menos":
        datos = get("/reportes/ventas", params={"fecha_inicio": fecha_inicio, "fecha_fin": fecha_fin})
        encabezados = ["Producto", "Cantidad vendida", "Total"]
        filas = [[f["producto"], f["cantidad"], f["total"]] for f in datos["productos_menos_vendidos"]]
        return "Productos menos vendidos", encabezados, filas

    if tipo == "pedidos":
        datos = get("/reportes/pedidos", params={"fecha_inicio": fecha_inicio, "fecha_fin": fecha_fin})
        encabezados = ["Folio", "Fecha", "Mesa", "Mesero", "Estatus", "Total"]
        filas = [
            [p["folio"], p["fecha_hora"][:16].replace("T", " "), p["id_mesa"] or "-", p["nombre_usuario"], p["estatus"], p["total"]]
            for p in datos["pedidos"]
        ]
        return "Reporte de pedidos", encabezados, filas

    if tipo == "inventario":
        ingredientes = get("/inventario")
        encabezados = ["Ingrediente", "Existencia", "Minimo", "Unidad", "Estado"]
        filas = [
            [i["nombre"], i["stock_actual"], i["stock_minimo"], i["unidad_medida"], "Bajo" if i["alerta"] else "OK"]
            for i in ingredientes
        ]
        return "Estado de inventario", encabezados, filas

    raise ValueError("tipo de reporte no valido")


@bp.route("/exportar")
@login_requerido
def exportar():
    tipo = request.args.get("tipo", "ventas")
    formato = request.args.get("formato", "pdf")
    fecha_inicio = request.args.get("fecha_inicio")
    fecha_fin = request.args.get("fecha_fin")

    titulo, encabezados, filas = _filas_reporte(tipo, fecha_inicio, fecha_fin)

    if formato == "xlsx":
        return _generar_xlsx(titulo, encabezados, filas)

    return _generar_pdf(titulo, fecha_inicio, fecha_fin, encabezados, filas)


def _generar_xlsx(titulo, encabezados, filas):
    libro = Workbook()
    hoja = libro.active
    hoja.title = titulo[:30]

    hoja.append(encabezados)
    for fila in filas:
        hoja.append(fila)

    memoria = io.BytesIO()
    libro.save(memoria)
    memoria.seek(0)

    return send_file(
        memoria,
        as_attachment=True,
        download_name=f"{titulo.lower().replace(' ', '_')}.xlsx",
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )


def _generar_pdf(titulo, fecha_inicio, fecha_fin, encabezados, filas):
    memoria = io.BytesIO()
    documento = SimpleDocTemplate(memoria, pagesize=letter)
    estilos = getSampleStyleSheet()

    elementos = [Paragraph("Coffee hub", estilos["Title"]), Paragraph(titulo, estilos["Heading2"])]
    if fecha_inicio and fecha_fin:
        elementos.append(Paragraph(f"Periodo: {fecha_inicio} a {fecha_fin}", estilos["Normal"]))
    elementos.append(Spacer(1, 16))

    tabla_datos = [encabezados] + [[str(c) for c in fila] for fila in filas]
    tabla = Table(tabla_datos, hAlign="LEFT")
    tabla.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#00343d")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f4efe8")]),
    ]))
    elementos.append(tabla)

    documento.build(elementos)
    memoria.seek(0)

    return send_file(
        memoria,
        as_attachment=True,
        download_name=f"{titulo.lower().replace(' ', '_')}.pdf",
        mimetype="application/pdf",
    )
