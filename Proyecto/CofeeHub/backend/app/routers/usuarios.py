from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_roles
from app.core.security import hash_password
from app.database import get_db
from app.models.roles import Rol
from app.models.usuarios import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioOut, UsuarioUpdate

router = APIRouter(prefix="/usuarios", tags=["usuarios"], dependencies=[Depends(require_roles("admin"))])


def _es_ultimo_admin_activo(db: Session, usuario: Usuario) -> bool:
    if usuario.rol.nombre != "admin" or not usuario.estatus:
        return False
    admins_activos = (
        db.query(Usuario).join(Rol).filter(Rol.nombre == "admin", Usuario.estatus == True).count()
    )
    return admins_activos <= 1


@router.get("", response_model=list[UsuarioOut])
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()


@router.get("/{usuario_id}", response_model=UsuarioOut)
def obtener_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    return usuario


@router.post("", response_model=UsuarioOut, status_code=status.HTTP_201_CREATED)
def crear_usuario(datos: UsuarioCreate, db: Session = Depends(get_db)):
    rol = db.query(Rol).filter(Rol.id == datos.id_rol).first()
    if not rol:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Rol no valido")

    existe = db.query(Usuario).filter(Usuario.correo == datos.correo).first()
    if existe:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ese correo ya esta registrado")

    nuevo = Usuario(
        nombre=datos.nombre,
        apellido_pat=datos.apellido_pat,
        apellido_mat=datos.apellido_mat,
        correo=datos.correo,
        contrasena=hash_password(datos.contrasena),
        id_rol=datos.id_rol,
        estatus=datos.estatus,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.put("/{usuario_id}", response_model=UsuarioOut)
def editar_usuario(
    usuario_id: int,
    datos: UsuarioUpdate,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(get_current_user),
):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

    datos_dict = datos.model_dump(exclude_unset=True)

    nuevo_rol = None
    if "id_rol" in datos_dict:
        nuevo_rol = db.query(Rol).filter(Rol.id == datos_dict["id_rol"]).first()
        if not nuevo_rol:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Rol no valido")

    se_desactiva = datos_dict.get("estatus") is False
    se_quita_admin = nuevo_rol is not None and nuevo_rol.nombre != "admin" and usuario.rol.nombre == "admin"

    if usuario.id == usuario_actual.id and (se_desactiva or se_quita_admin):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes desactivar tu propia cuenta ni quitarte el rol de administrador",
        )

    if (se_desactiva or se_quita_admin) and _es_ultimo_admin_activo(db, usuario):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes desactivar ni cambiar de rol al unico administrador activo",
        )

    if "contrasena" in datos_dict:
        datos_dict["contrasena"] = hash_password(datos_dict["contrasena"])

    for campo, valor in datos_dict.items():
        setattr(usuario, campo, valor)

    db.commit()
    db.refresh(usuario)
    return usuario


@router.delete("/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_usuario(
    usuario_id: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(get_current_user),
):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

    if usuario.id == usuario_actual.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No puedes eliminar tu propia cuenta")

    if _es_ultimo_admin_activo(db, usuario):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No puedes eliminar al unico administrador activo"
        )

    db.delete(usuario)
    db.commit()
