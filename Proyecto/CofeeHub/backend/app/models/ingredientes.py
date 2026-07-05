from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Ingrediente(Base):
    __tablename__ = "ingredientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)
    stock_actual = Column(Numeric(10, 2), nullable=False, default=0)
    stock_minimo = Column(Numeric(10, 2), nullable=False, default=0)
    unidad_medida = Column(String(20), nullable=False)

    usado_en = relationship("ProdIngred", back_populates="ingrediente")

    @property
    def alerta(self) -> bool:
        return self.stock_actual <= self.stock_minimo


class ProdIngred(Base):
    __tablename__ = "prod_ingred"

    id = Column(Integer, primary_key=True, index=True)
    id_producto = Column(Integer, ForeignKey("productos.id"), nullable=False)
    id_ingrediente = Column(Integer, ForeignKey("ingredientes.id"), nullable=False)
    cantidad_usada = Column(Numeric(10, 2), nullable=False)

    producto = relationship("Producto", back_populates="ingredientes")
    ingrediente = relationship("Ingrediente", back_populates="usado_en")
