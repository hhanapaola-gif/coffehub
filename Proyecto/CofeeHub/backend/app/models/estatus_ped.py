from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class EstatusPed(Base):
    __tablename__ = "estatus_ped"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)

    pedidos = relationship("Pedido", back_populates="estatus_pedido")
