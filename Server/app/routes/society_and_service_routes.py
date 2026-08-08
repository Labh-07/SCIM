from typing import Annotated
from fastapi import APIRouter,Depends,status
from fastapi.exceptions import HTTPException

from app.config.schemas import SocietyCreate , SocietyPrivateResponse , SocietyPubliResponse , UserPrivateResponse , UserUpdate,SocietyPubliResponse , SocietyPrivateResponse ,UserPublicResponse , MakeSecratery
from app.config.database import get_db
from app.models.model import Society,User
from app.config.auth import CurrntUser
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select,func 

router = APIRouter()

#region society

@router.get("")
async def get_all_society( db:Annotated[AsyncSession , Depends(get_db)]):
    result = await db.execute(select(Society))
    society_list = result.scalars().all()
    return society_list

@router.get("/{society_id}" , response_model=SocietyPubliResponse)
async def get_society(society_id:int , db:Annotated[AsyncSession , Depends(get_db)]):
    result =await db.execute(select(Society).where(Society.id == society_id))

    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society not exist")

    return society_exist

@router.get("/{society_id}/insights",response_model=SocietyPrivateResponse)
async def get_society_insights(society_id:int , db:Annotated[AsyncSession , Depends(get_db)]):
    result = await db.execute(select(Society).where(Society.id == society_id))

    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society not exist")

    return society_exist


@router.get("/secratery", response_model=UserPublicResponse)
async def get_secratery(society_id:int,db:Annotated[AsyncSession , Depends(get_db)]):
    result = await db.execute(select(User).where(User.societyid == society_id , func.lower(User.role) == "admin"))
    secratery_exist = result.scalars().first()

    if not secratery_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST ,detail="Admin not exist")

    return secratery_exist

#endregion

#region residents

@router.get("/{society_id}/residents")
async def get_all_residents(society_id:int , db:Annotated[AsyncSession,Depends(get_db)]) -> list[UserPublicResponse]:
    result = await db.execute(select(User).where(User.societyid == society_id))

    return result.scalars().all() or []

@router.patch("/{society_id}/resident/{resident_id}",response_model=UserPrivateResponse)
async def update_resident(society_id:int ,resident_id:int, updated_data :UserUpdate, current_user:CurrntUser , db:Annotated[AsyncSession,Depends(get_db)]):

    if current_user.role != "Admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="You are unauthorized to update resident")

    result =await db.execute(select(Society).where(Society.id == society_id))  
    society_exist = result.scalars().first()
    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society not exist")

    result = await db.execute(select(User).where(User.id == resident_id))
    db_user = result.scalars().first()

    if not db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="User not exist")

    update_user_dict = updated_data.model_dump(exclude_unset=True)

    if not update_user_dict:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided for update")

    for key,value in update_user_dict.items():
        setattr(db_user , key , value)

    await db.commit()
    await db.refresh(db_user)

    return db_user


#endregion
