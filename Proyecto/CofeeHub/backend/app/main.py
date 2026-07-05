from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, gastos, inventario, menu, mesas, pagos, pedidos, promociones, reportes, roles, usuarios

app = FastAPI(title="Cofeehub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(usuarios.router)
app.include_router(roles.router)
app.include_router(menu.router)
app.include_router(inventario.router)
app.include_router(mesas.router)
app.include_router(promociones.router)
app.include_router(pedidos.router)
app.include_router(pagos.router)
app.include_router(gastos.router)
app.include_router(reportes.router)


@app.get("/")
def root():
    return {"mensaje": "API cofeehub corriendo"}
