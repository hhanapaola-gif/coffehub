from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class CategoriaGasto(Base):
    __tablename__ = "categoria_gastos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)

    gastos = relationship("Gasto", back_populates="categoria")


class Gasto(Base):
    __tablename__ = "gastos"

    id = Column(Integer, primary_key=True, index=True)
    descripcion = Column(Text, nullable=False)
    monto = Column(Numeric(10, 2), nullable=False)
    fecha_pago = Column(DateTime(timezone=True), server_default=func.now())
    id_categoria_gast = Column(Integer, ForeignKey("categoria_gastos.id"), nullable=False)
    id_usuario = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    categoria = relationship("CategoriaGasto", back_populates="gastos")
    usuario = relationship("Usuario", back_populates="gastos")
