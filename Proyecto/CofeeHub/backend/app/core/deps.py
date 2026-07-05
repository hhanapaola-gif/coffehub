from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.database import get_db
from app.models.usuarios import Usuario

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# tokens invalidados por logout, se pierden si se reinicia el server
tokens_revocados = set()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Usuario:
    credenciales_invalidas = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar la sesion",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if token in tokens_revocados:
        raise credenciales_invalidas

    payload = decode_token(token)
    if payload is None or payload.get("type") != "access":
        raise credenciales_invalidas

    user_id = payload.get("sub")
    if user_id is None:
        raise credenciales_invalidas

    usuario = db.query(Usuario).filter(Usuario.id == int(user_id)).first()
    if usuario is None or not usuario.estatus:
        raise credenciales_invalidas

    return usuario


def require_roles(*roles_permitidos: str):
    def checker(usuario: Usuario = Depends(get_current_user)) -> Usuario:
        if usuario.rol.nombre not in roles_permitidos:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permiso para acceder a este modulo",
            )
        return usuario

    return checker
