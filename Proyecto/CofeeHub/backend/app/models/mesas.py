from sqlalchemy import Column, Integer, Boolean
from sqlalchemy.orm import relationship

from app.database import Base


class Mesa(Base):
    __tablename__ = "mesas"

    id = Column(Integer, primary_key=True, index=True)
    capacidad = Column(Integer, nullable=False, default=4)
    estatus = Column(Boolean, default=True)  # true = disponible, false = ocupada

    pedidos = relationship("Pedido", back_populates="mesa")
