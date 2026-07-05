"""
script para crear las tablas y meter datos de prueba
correr con: venv/Scripts/python.exe seed.py
"""
from datetime import date, timedelta

from app.database import Base, SessionLocal, engine
from app.core.security import hash_password
from app.models.roles import Rol
from app.models.usuarios import Usuario
from app.models.productos import CategoriaProd, Producto
from app.models.ingredientes import Ingrediente, ProdIngred
from app.models.promociones import Promocion
from app.models.mesas import Mesa
from app.models.estatus_ped import EstatusPed
from app.models.pagos import MetodoPago
from app.models.gastos import CategoriaGasto

Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    if db.query(Rol).count() == 0:
        roles = [Rol(nombre="admin"), Rol(nombre="mesero"), Rol(nombre="cocina"), Rol(nombre="cajero")]
        db.add_all(roles)
        db.commit()
        print("roles creados")

    if db.query(EstatusPed).count() == 0:
        estatus = [EstatusPed(nombre="pendiente"), EstatusPed(nombre="en_preparacion"),
                   EstatusPed(nombre="listo"), EstatusPed(nombre="pagado"), EstatusPed(nombre="cancelado")]
        db.add_all(estatus)
        db.commit()
        print("estatus de pedido creados")

    if db.query(MetodoPago).count() == 0:
        metodos = [MetodoPago(nombre="Efectivo"), MetodoPago(nombre="Tarjeta"),
                   MetodoPago(nombre="Transferencia"), MetodoPago(nombre="Otro")]
        db.add_all(metodos)
        db.commit()
        print("metodos de pago creados")

    if db.query(CategoriaGasto).count() == 0:
        cats_gasto = [CategoriaGasto(nombre="Suministros"), CategoriaGasto(nombre="Servicios"),
                      CategoriaGasto(nombre="Mantenimiento"), CategoriaGasto(nombre="Otros")]
        db.add_all(cats_gasto)
        db.commit()
        print("categorias de gasto creadas")

    if db.query(Mesa).count() == 0:
        mesas = [Mesa(capacidad=4, estatus=True) for _ in range(12)]
        db.add_all(mesas)
        db.commit()
        print("mesas creadas")

    if db.query(CategoriaProd).count() == 0:
        cat_bebidas = CategoriaProd(nombre="Bebidas")
        cat_alimentos = CategoriaProd(nombre="Alimentos")
        cat_postres = CategoriaProd(nombre="Postres")
        db.add_all([cat_bebidas, cat_alimentos, cat_postres])
        db.commit()

        productos = [
            Producto(nombre="Cappuccino", descripcion="Espresso con leche vaporizada y espuma", precio=45,
                      id_categoria_prod=cat_bebidas.id),
            Producto(nombre="Latte Vainilla", descripcion="Espresso con leche y jarabe de vainilla", precio=52,
                      id_categoria_prod=cat_bebidas.id),
            Producto(nombre="Espresso Doble", descripcion="Doble shot de espresso", precio=38,
                      id_categoria_prod=cat_bebidas.id),
            Producto(nombre="Croissant de Mantequilla", descripcion="Croissant horneado", precio=35,
                      id_categoria_prod=cat_alimentos.id),
            Producto(nombre="Sandwich Club", descripcion="Sandwich triple con pollo y tocino", precio=68,
                      id_categoria_prod=cat_alimentos.id),
            Producto(nombre="Tostada Aguacate", descripcion="Pan tostado con aguacate", precio=72,
                      id_categoria_prod=cat_alimentos.id),
            Producto(nombre="Pastel de Chocolate", descripcion="Rebanada de pastel de chocolate", precio=55,
                      id_categoria_prod=cat_postres.id),
            Producto(nombre="Cheesecake Fresa", descripcion="Cheesecake con fresa", precio=58,
                      id_categoria_prod=cat_postres.id),
        ]
        db.add_all(productos)
        db.commit()
        print("categorias y productos creados")

    if db.query(Ingrediente).count() == 0:
        ingredientes = [
            Ingrediente(nombre="Cafe Espresso", stock_actual=800, stock_minimo=1000, unidad_medida="g"),
            Ingrediente(nombre="Leche Entera", stock_actual=2500, stock_minimo=3000, unidad_medida="ml"),
            Ingrediente(nombre="Leche Deslactosada", stock_actual=4000, stock_minimo=2000, unidad_medida="ml"),
            Ingrediente(nombre="Azucar", stock_actual=1200, stock_minimo=1000, unidad_medida="g"),
            Ingrediente(nombre="Harina", stock_actual=500, stock_minimo=1000, unidad_medida="g"),
            Ingrediente(nombre="Mantequilla", stock_actual=3000, stock_minimo=1000, unidad_medida="g"),
            Ingrediente(nombre="Chocolate", stock_actual=1800, stock_minimo=1000, unidad_medida="g"),
            Ingrediente(nombre="Pan de caja", stock_actual=20, stock_minimo=10, unidad_medida="piezas"),
            Ingrediente(nombre="Aguacate", stock_actual=15, stock_minimo=10, unidad_medida="piezas"),
            Ingrediente(nombre="Jarabe de vainilla", stock_actual=1000, stock_minimo=500, unidad_medida="ml"),
        ]
        db.add_all(ingredientes)
        db.commit()
        print("ingredientes creados")

        prods = {p.nombre: p for p in db.query(Producto).all()}
        ings = {i.nombre: i for i in db.query(Ingrediente).all()}

        relaciones = [
            ("Cappuccino", "Cafe Espresso", 20), ("Cappuccino", "Leche Entera", 50),
            ("Latte Vainilla", "Cafe Espresso", 20), ("Latte Vainilla", "Leche Entera", 60),
            ("Latte Vainilla", "Jarabe de vainilla", 15),
            ("Espresso Doble", "Cafe Espresso", 18),
            ("Croissant de Mantequilla", "Harina", 80), ("Croissant de Mantequilla", "Mantequilla", 30),
            ("Sandwich Club", "Pan de caja", 2),
            ("Tostada Aguacate", "Pan de caja", 2), ("Tostada Aguacate", "Aguacate", 1),
            ("Pastel de Chocolate", "Chocolate", 40), ("Pastel de Chocolate", "Harina", 60),
            ("Cheesecake Fresa", "Harina", 40),
        ]
        for nombre_prod, nombre_ing, cantidad in relaciones:
            db.add(ProdIngred(id_producto=prods[nombre_prod].id, id_ingrediente=ings[nombre_ing].id,
                               cantidad_usada=cantidad))
        db.commit()
        print("relaciones producto-ingrediente creadas")

    if db.query(Promocion).count() == 0:
        hoy = date.today()
        promos = [
            Promocion(nombre="Happy Hour Cafe", descripcion="2x1 en todos los espressos de 14:00 a 16:00 hrs",
                      descuento=10, fecha_inicio=hoy, fecha_fin=hoy + timedelta(days=90), estatus=True,
                      monto_minimo=100),
            Promocion(nombre="Combo Desayuno", descripcion="Cafe + Croissant con descuento",
                      descuento=15, fecha_inicio=hoy, fecha_fin=hoy + timedelta(days=90), estatus=True,
                      monto_minimo=150),
            Promocion(nombre="Postre del Dia", descripcion="Pastel con bebida caliente a precio especial",
                      descuento=20, fecha_inicio=hoy, fecha_fin=hoy + timedelta(days=90), estatus=True,
                      monto_minimo=200),
        ]
        db.add_all(promos)
        db.commit()
        print("promociones creadas")

    if db.query(Usuario).count() == 0:
        rol_admin = db.query(Rol).filter(Rol.nombre == "admin").first()
        rol_mesero = db.query(Rol).filter(Rol.nombre == "mesero").first()
        rol_cocina = db.query(Rol).filter(Rol.nombre == "cocina").first()
        rol_cajero = db.query(Rol).filter(Rol.nombre == "cajero").first()

        usuarios = [
            Usuario(nombre="Isabel", apellido_pat="Perez", apellido_mat="Lopez", correo="admin@coffeehub.com",
                    contrasena=hash_password("admin123"), id_rol=rol_admin.id, estatus=True),
            Usuario(nombre="Daniela", apellido_pat="Martinez", apellido_mat="Ruiz", correo="mesero@coffeehub.com",
                    contrasena=hash_password("mesero123"), id_rol=rol_mesero.id, estatus=True),
            Usuario(nombre="Santi", apellido_pat="Garcia", apellido_mat="Sanchez", correo="cocina@coffeehub.com",
                    contrasena=hash_password("cocina123"), id_rol=rol_cocina.id, estatus=True),
            Usuario(nombre="Paola", apellido_pat="Lopez", apellido_mat="Diaz", correo="cajero@coffeehub.com",
                    contrasena=hash_password("cajero123"), id_rol=rol_cajero.id, estatus=True),
        ]
        db.add_all(usuarios)
        db.commit()
        print("usuarios de prueba creados")

    print("listo, base de datos poblada")
finally:
    db.close()
