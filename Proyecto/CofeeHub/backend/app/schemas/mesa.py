from pydantic import BaseModel


class MesaOut(BaseModel):
    id: int
    capacidad: int
    estatus: bool

    class Config:
        from_attributes = True


class MesaCreate(BaseModel):
    capacidad: int = 4
    estatus: bool = True


class MesaUpdate(BaseModel):
    capacidad: int | None = None
    estatus: bool | None = None
