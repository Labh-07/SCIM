from typing import Annotated
from fastapi import APIRouter,Depends,status
from fastapi.exceptions import HTTPException

from app.config.schemas import SocietyCreate , SocietyPrivateResponse , SocietyPubliResponse , UserPrivateResponse , UserPublicResponse , MakeSecratery
from app.config.database import get_db
from app.models.model import Society,User

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select,func

router = APIRouter()

@router.post("/society",response_model=SocietyPrivateResponse , tags=["Admin"])
async def create_society(society_data:SocietyCreate , db:Annotated[AsyncSession , Depends(get_db)]):
    result = await db.execute(select(Society).where(func.lower(Society.societyname) == society_data.societyname.lower()))
    society_exist = result.scalars().first()

    if society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Societyname already exist")

    # result= await db.execute(select(User).where(User.id == society_data.secretryid))
    # user_exist = result.scalars().first()

    # if not user_exist:
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Secrater not exist !!!")

    # user_exist.role = "Admin" #temp

    new_society = Society(
        societyname = society_data.societyname,
        address = society_data.address,
    )

    db.add(new_society)
    await db.commit()
    await db.refresh(new_society)

    return new_society


@router.post("/society/secratery", response_model=UserPrivateResponse)
async def make_secratery(data:MakeSecratery,db:Annotated[AsyncSession , Depends(get_db)]):

    result= await db.execute(select(Society).where(Society.id== data.society_id))
    society_exist = result.scalars().first()
    
    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society not exist !!!")

    result= await db.execute(select(User).where(User.societyid== data.society_id , User.role == "Admin"))
    admin_exist = result.scalars().first()

    if admin_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Admin already exist !!!")

    result= await db.execute(select(User).where(User.id == data.user_id ,  User.societyid == data.society_id))
    user_exist = result.scalars().first()

    if not user_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="User not found !!!")

    user_exist.role = "Admin" 

    await db.commit()
    await db.refresh(user_exist)

    return user_exist