from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..core.deps import get_current_user
from ..database import get_db
from ..models import User
from ..schemas import ProfileUpdate, UserOut

router = APIRouter(tags=["profile"])


# NOTE: POST is semantically wrong for an update (should be PATCH); kept as
# POST to match the shipped frontend contract.
@router.post("/profile", response_model=UserOut, response_model_by_alias=True)
def update_profile(payload: ProfileUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.name is not None:
        user.name = payload.name.strip()
    if payload.region is not None:
        user.region = payload.region.strip() or None
    if payload.primary_crop is not None:
        user.primary_crop = payload.primary_crop
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserOut.model_validate(user, from_attributes=True)
