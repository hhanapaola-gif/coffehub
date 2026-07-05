from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, oauth2_scheme, tokens_revocados
from app.core.security import create_access_token, create_refresh_token, decode_token, verify_password
from app.database import get_db
from app.models.usuarios import Usuario
from app.schemas.auth import AccessTokenResponse, LoginRequest, RefreshRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["autenticacion"])

MAX_INTENTOS_FALLIDOS = 5
BLOQUEO_MINUTOS = 15

# se borra si se reinicia el server, es intencional
intentos_fallidos: dict[str, dict] = {}


@router.post("/login", response_model=TokenResponse)
def login(datos: LoginRequest, db: Session = Depends(get_db)):
    correo = datos.correo.strip().lower()
    ahora = datetime.now(timezone.utc)

    registro = intentos_fallidos.get(correo)
    if registro and registro["bloqueado_hasta"] and registro["bloqueado_hasta"] > ahora:
        restante = int((registro["bloqueado_hasta"] - ahora).total_seconds() // 60) + 1
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Demasiados intentos fallidos, intenta de nuevo en {restante} minutos",
        )

    usuario = db.query(Usuario).filter(Usuario.correo == datos.correo).first()

    if not usuario or not verify_password(datos.contrasena, usuario.contrasena):
        registro = intentos_fallidos.setdefault(correo, {"conteo": 0, "bloqueado_hasta": None})
        registro["conteo"] += 1
        if registro["conteo"] >= MAX_INTENTOS_FALLIDOS:
            registro["bloqueado_hasta"] = ahora + timedelta(minutes=BLOQUEO_MINUTOS)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Correo o contrasena incorrectos")

    intentos_fallidos.pop(correo, None)

    if not usuario.estatus:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Usuario inactivo")

    access_token = create_access_token(usuario.id, usuario.rol.nombre)
    refresh_token = create_refresh_token(usuario.id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        rol=usuario.rol.nombre,
        nombre=usuario.nombre,
    )


@router.post("/refresh", response_model=AccessTokenResponse)
def refresh(datos: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_token(datos.refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token invalido")

    usuario = db.query(Usuario).filter(Usuario.id == int(payload["sub"])).first()
    if usuario is None or not usuario.estatus:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado")

    nuevo_access = create_access_token(usuario.id, usuario.rol.nombre)
    return AccessTokenResponse(access_token=nuevo_access)


@router.post("/logout")
def logout(token: str = Depends(oauth2_scheme), usuario: Usuario = Depends(get_current_user)):
    tokens_revocados.add(token)
    return {"mensaje": "sesion cerrada"}
