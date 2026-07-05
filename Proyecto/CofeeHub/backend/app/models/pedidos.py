from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    folio = Column(String(20), nullable=False, unique=True, index=True)
    fecha_hora = Column(DateTime(timezone=True), server_default=func.now())
    id_estatus_ped = Column(Integer, ForeignKey("estatus_ped.id"), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False, default=0)
    descuento = Column(Numeric(10, 2), nullable=False, default=0)
    total = Column(Numeric(10, 2), nullable=False, default=0)
    id_mesa = Column(Integer, ForeignKey("mesas.id"), nullable=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    id_promocion = Column(Integer, ForeignKey("promociones.id"), nullable=True)

    estatus_pedido = relationship("EstatusPed", back_populates="pedidos")
    mesa = relationship("Mesa", back_populates="pedidos")
    usuario = relationship("Usuario", back_populates="pedidos")
    promocion = relationship("Promocion", back_populates="pedidos")
    detalles = relationship("DetallePedido", back_populates="pedido", cascade="all, delete-orphan")
    pago = relationship("Pago", back_populates="pedido", uselist=False)


class DetallePedido(Base):
    __tablename__ = "detalle_pedido"

    id = Column(Integer, primary_key=True, index=True)
    id_pedido = Column(Integer, ForeignKey("pedidos.id"), nullable=False)
    id_producto = Column(Integer, ForeignKey("productos.id"), nullable=False)
    cantidad = Column(Integer, nullable=False, default=1)
    observaciones = Column(String(150), nullable=True)
    subtotal = Column(Numeric(10, 2), nullable=False)

    pedido = relationship("Pedido", back_populates="detalles")
    producto = relationship("Producto", back_populates="detalles_pedido")
