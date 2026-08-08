from pydantic import BaseModel , ConfigDict , Field , EmailStr 
from datetime import datetime

#region login schema : 
class UserBase(BaseModel):
    username:str = Field(min_length=1 , max_length=50)
    email:EmailStr = Field(max_length=150)

class UserCreate(UserBase):
    password:str =  Field(min_length=8)
    role:str = Field(min_length=1,max_length=20)
    societyid:str|None = None
    block:str|None = None
    residentname:str = Field(min_length=1 , max_length=30)
    mobileno:str = Field(min_length=10 , max_length=10)
    flatno:int
    


class UserPublicResponse(BaseModel):
    model_config = ConfigDict(from_attribute =True)

    id:int
    username:str
    residentname:str
    mobileno:str
    block:str|None
    flatno:int
    role:str


class UserPrivateResponse(UserPublicResponse):
    email:EmailStr
    societyid:int|None

class UserUpdate(BaseModel):
    model_config = ConfigDict(from_attribute =True)

    residentname:str|None
    mobileno:str|None
    block:str|None
    flatno:int|None

class Login(BaseModel):
    access_token:str
    token_type:str
    role:str
#endregion

#region society

class SocietyBase(BaseModel):
    societyname:str=Field(min_length=1 , max_length=50)
    address:str =  Field(min_length=1,max_length=300)

class SocietyCreate(SocietyBase):
    pass

class SocietyPubliResponse(SocietyBase):
    model_config =ConfigDict(from_attributes=True)

    id:int

class SocietyPrivateResponse(SocietyPubliResponse):
    pass #budget and all


#endregion

#region admin

class MakeSecratery(BaseModel):
    society_id:int
    user_id:int
#endregion

#region notices
class AuthorResponse(BaseModel):
    model_config=ConfigDict(from_attributes=True)

    username:str

class NoticeBase(BaseModel):
    title:str = Field(min_length=1 , max_length=100)
    content:str = Field(min_length=1,max_length=500)
    important:bool = Field(default=False)

class NoticeCreate(NoticeBase):
    societyid:int
    userid:int

class NoticePublicResponse(NoticeBase):
    model_config=ConfigDict(from_attributes=True)

    id:int
    createdon:datetime
    author:AuthorResponse

class NoticePrivateResponse(NoticePublicResponse):
    pass
#endregion