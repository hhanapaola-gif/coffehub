from sqlalchemy import Column, Integer, String, Text, Numeric, Date, Boolean
from sqlalchemy.orm import relationship

from app.database import Base


class Promocion(Base):
    __tablename__ = "promociones"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    descripcion = Column(Text, nullable=True)
    descuento = Column(Numeric(5, 2), nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    estatus = Column(Boolean, default=True)
    monto_minimo = Column(Numeric(10, 2), nullable=False, default=0)

    pedidos = relationship("Pedido", back_populates="promocion")
