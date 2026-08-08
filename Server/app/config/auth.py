from pwdlib import PasswordHash
import jwt 
from datetime import timedelta,UTC,datetime
from app.config.config import settings
from fastapi.security import OAuth2PasswordBearer
from typing  import Annotated
from app.models.model import User 
from fastapi import Depends,status
from sqlalchemy.ext.asyncio import AsyncSession
from app.config.database import get_db
from fastapi.exceptions import HTTPException
from sqlalchemy import select
oauth2_schema = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

password_hash = PasswordHash.recommended() #argon2

def hash_password(plain_password:str)->str:
    return password_hash.hash(plain_password)

def verify_password(plain_password:str , hash_password:str)->bool :
    return password_hash.verify(plain_password,hash_password)

def create_access_token(data:dict , expires_time:timedelta | None = None)->str :
    """create jwt access token"""
    to_encode = data.copy()

    if expires_time:
        expire = datetime.now(UTC) + expires_time
    else:
        expire = datetime.now(UTC) + timedelta(minutes=settings.token_expiration_time,)

    to_encode.update({"exp":expire})

    encoded_jwt = jwt.encode(to_encode,settings.secret_key.get_secret_value() , algorithm=settings.algorithm)
    print(encoded_jwt)
    return encoded_jwt

def verify_access_token(token:str) -> str |None:
    try:
        payload = jwt.decode(
            token,
            settings.secret_key.get_secret_value(),
            algorithms=[settings.algorithm],
            options={"require": ["exp", "sub"]},
        )
    except jwt.InvalidTokenError:
        return None
    else:
        return payload.get("sub")



async def get_current_user(token:Annotated[str,Depends(oauth2_schema)] , db:Annotated[AsyncSession , Depends(get_db)]):
    user_id = verify_access_token(token)
    if user_id is None :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Invalid token or expire token !!!" , headers={"WWW-Authenticate":"Bearer"})

    try:
        user_id_int = int(user_id)
    except (TypeError , ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Invalid token or expire token !!!" , headers={"WWW-Authenticate":"Bearer"})

    result = await db.execute(select(User).where(User.id == user_id_int))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="User not found !!!" , headers={"WWW-Authenticate":"Bearer"})

    return user

CurrntUser = Annotated[User , Depends(get_current_user)]