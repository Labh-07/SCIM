from typing import Annotated
from fastapi import  APIRouter , Depends,status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

from app.models.model import User
from app.config.schemas import UserCreate , UserPrivateResponse , UserPublicResponse , Login
from app.config.auth import hash_password , verify_password , create_access_token , CurrntUser
from app.config.config import settings

from app.config.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import Select,func

from fastapi.exceptions import HTTPException

router = APIRouter()

@router.post("/register" ,status_code=status.HTTP_201_CREATED , response_model=UserPrivateResponse)
async def create_user(user:UserCreate , db:Annotated[AsyncSession , Depends(get_db)]):
    print(user.societyid)
    result = await db.execute(Select(User).where(func.lower(User.username) == user.username.lower()))
    username_exist = result.scalars().first()

    if username_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="username already exist")

    result = await db.execute(Select(User).where(func.lower(User.email) == user.email))
    email_exist = result.scalars().first() or False

    if email_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="email already registred")

    new_user = User(
        username=user.username,
        email = user.email,
        role=user.role,
        password_hash=hash_password(user.password),

        residentname=user.residentname,
        mobileno = user.mobileno,
    
        societyid=int(user.societyid),
        block=user.block,
        flatno=user.flatno,
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user


@router.post("/login" , response_model=Login)
async def login_for_access_token(form_data:Annotated[OAuth2PasswordRequestForm,Depends()] , db:Annotated[AsyncSession , Depends(get_db)]):
    print(form_data.scopes[0].lower())
    result = await db.execute(Select(User).where(func.lower(User.email) == form_data.username.lower() , func.lower(User.role) == form_data.scopes[0].lower()))
    user = result.scalars().first()

    if not user or not verify_password(form_data.password , user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Invalid credentials !!!",
            headers={"WWW-Authenticate": "Bearer"})

    # if len(form_data.scopes)==0:
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Scope is missing,login again")
    
    token_expiration_time = timedelta(minutes=settings.token_expiration_time)

    payload = {
        "sub" :str(user.id),
    }

    if len(form_data.scopes)!=0:
        role = form_data.scopes[0]
    else:
        role="Resident"

    access_token = create_access_token(data=payload , expires_time=token_expiration_time)
    return Login(access_token=access_token , token_type="bearer" , role=role)

@router.get("/me",response_model=UserPrivateResponse)
async def get_me(current_user:CurrntUser):
    return current_user
