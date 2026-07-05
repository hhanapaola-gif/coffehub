from pydantic import BaseModel, EmailStr


class UsuarioBase(BaseModel):
    nombre: str
    apellido_pat: str
    apellido_mat: str | None = None
    correo: EmailStr
    id_rol: int
    estatus: bool = True


class UsuarioCreate(UsuarioBase):
    contrasena: str


class UsuarioUpdate(BaseModel):
    nombre: str | None = None
    apellido_pat: str | None = None
    apellido_mat: str | None = None
    correo: EmailStr | None = None
    id_rol: int | None = None
    estatus: bool | None = None
    contrasena: str | None = None


class RolOut(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True


class UsuarioOut(BaseModel):
    id: int
    nombre: str
    apellido_pat: str
    apellido_mat: str | None
    correo: str
    estatus: bool
    rol: RolOut

    class Config:
        from_attributes = True
