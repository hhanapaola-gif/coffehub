from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido_pat = Column(String(100), nullable=False)
    apellido_mat = Column(String(100), nullable=True)
    correo = Column(String(100), nullable=False, unique=True, index=True)
    contrasena = Column(String(100), nullable=False)
    id_rol = Column(Integer, ForeignKey("roles.id"), nullable=False)
    estatus = Column(Boolean, default=True)

    rol = relationship("Rol", back_populates="usuarios")
    pedidos = relationship("Pedido", back_populates="usuario")
    gastos = relationship("Gasto", back_populates="usuario")
