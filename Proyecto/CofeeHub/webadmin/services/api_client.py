"""wrapper para pegarle al api de fastapi desde flask"""
import requests
from flask import session

from config import API_BASE_URL


class ApiError(Exception):
    def __init__(self, mensaje, status_code=500):
        super().__init__(mensaje)
        self.mensaje = mensaje
        self.status_code = status_code


def _headers():
    token = session.get("access_token")
    if not token:
        return {}
    return {"Authorization": f"Bearer {token}"}


def _procesar(respuesta):
    if respuesta.status_code == 204:
        return None
    if respuesta.status_code >= 400:
        try:
            detalle = respuesta.json().get("detail", "Error en la peticion")
        except ValueError:
            detalle = "Error en la peticion"
        raise ApiError(detalle, respuesta.status_code)
    if respuesta.content:
        return respuesta.json()
    return None


def get(ruta, params=None):
    r = requests.get(f"{API_BASE_URL}{ruta}", headers=_headers(), params=params, timeout=10)
    return _procesar(r)


def post(ruta, datos=None):
    r = requests.post(f"{API_BASE_URL}{ruta}", headers=_headers(), json=datos, timeout=10)
    return _procesar(r)


def put(ruta, datos=None):
    r = requests.put(f"{API_BASE_URL}{ruta}", headers=_headers(), json=datos, timeout=10)
    return _procesar(r)


def delete(ruta):
    r = requests.delete(f"{API_BASE_URL}{ruta}", headers=_headers(), timeout=10)
    return _procesar(r)


def login(correo, contrasena):
    r = requests.post(f"{API_BASE_URL}/auth/login", json={"correo": correo, "contrasena": contrasena}, timeout=10)
    return _procesar(r)
