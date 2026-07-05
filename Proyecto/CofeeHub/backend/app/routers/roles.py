from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import require_roles
from app.database import get_db
from app.models.roles import Rol
from app.schemas.usuario import RolOut

router = APIRouter(prefix="/roles", tags=["roles"], dependencies=[Depends(require_roles("admin"))])


@router.get("", response_model=list[RolOut])
def listar_roles(db: Session = Depends(get_db)):
    return db.query(Rol).all()
