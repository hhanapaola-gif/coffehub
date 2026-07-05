from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class CategoriaProd(Base):
    __tablename__ = "categorias_prod"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False, unique=True)

    productos = relationship("Producto", back_populates="categoria")


class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=True)
    precio = Column(Numeric(10, 2), nullable=False)
    estatus = Column(Boolean, default=True)
    id_categoria_prod = Column(Integer, ForeignKey("categorias_prod.id"), nullable=False)

    categoria = relationship("CategoriaProd", back_populates="productos")
    ingredientes = relationship("ProdIngred", back_populates="producto", cascade="all, delete-orphan")
    detalles_pedido = relationship("DetallePedido", back_populates="producto")
