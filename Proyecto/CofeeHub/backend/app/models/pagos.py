from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class MetodoPago(Base):
    __tablename__ = "metodos_pago"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)

    pagos = relationship("Pago", back_populates="metodo")


class Pago(Base):
    __tablename__ = "pagos"

    id = Column(Integer, primary_key=True, index=True)
    id_pedido = Column(Integer, ForeignKey("pedidos.id"), nullable=False, unique=True)
    id_metodo = Column(Integer, ForeignKey("metodos_pago.id"), nullable=False)
    monto = Column(Numeric(10, 2), nullable=False)
    monto_recibido = Column(Numeric(10, 2), nullable=True)
    cambio = Column(Numeric(10, 2), nullable=True)
    fecha_pago = Column(DateTime(timezone=True), server_default=func.now())

    pedido = relationship("Pedido", back_populates="pago")
    metodo = relationship("MetodoPago", back_populates="pagos")
