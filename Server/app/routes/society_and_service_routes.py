from typing import Annotated
from fastapi import APIRouter,Depends,status
from fastapi.exceptions import HTTPException

from app.config.schemas import SocietyCreate , SocietyPrivateResponse , SocietyPubliResponse , UserPrivateResponse , UserUpdate,SocietyPubliResponse , SocietyPrivateResponse ,UserPublicResponse , MakeSecratery , NoticeCreate,NoticePublicResponse,EventUpdate,NoticePrivateResponse, EventCreate , EventPublicResponse , EventPrivateResponse
from app.config.database import get_db
from app.models.model import Society,User,Notice,Event
from app.config.auth import CurrntUser
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select,func 
from sqlalchemy.orm import joinedload

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

#region notices 

@router.post("/{society_id}/notices",response_model=NoticePrivateResponse,status_code=status.HTTP_201_CREATED,tags=["Notice"])
async def create_notice(society_id:int,notice_data:NoticeCreate , db:Annotated[AsyncSession,Depends(get_db)]):
    result =await db.execute(select(Society).where(Society.id == notice_data.societyid))
    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society Not exist")

    result =await db.execute(select(User).where(User.id == notice_data.userid , func.lower(User.role) == "admin"))
    user_exist = result.scalars().first()

    if not user_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="User not exist")

    result = await db.execute(select(Notice).where(func.lower(Notice.title) == notice_data.title.lower()))
    notice_exist = result.scalars().first()

    if notice_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Title is already exist")

    
    new_notice=Notice(
        title = notice_data.title,
        content = notice_data.content,
        important = notice_data.important,
        userid = notice_data.userid,
        societyid = society_id,
    )

    db.add(new_notice)
    await db.commit()
    await db.refresh(new_notice)

    new_notice.author = user_exist 

    return new_notice

@router.get("/{society_id}/notices",tags=["Notice"])
async def get_all_notice(society_id:int,db:Annotated[AsyncSession,Depends(get_db)]) -> list[NoticePublicResponse]:
    result =await db.execute(select(Society).where(Society.id == society_id))
    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society Not exist")

    result = await db.execute(select(Notice).options(joinedload(Notice.author)).where(Notice.societyid == society_id))

    return result.scalars().all()

@router.delete("/{society_id}/notice/{notice_id}",status_code=status.HTTP_200_OK,tags=["Notice"])
async def delete_notice(society_id:int,notice_id:int,db:Annotated[AsyncSession,Depends(get_db)]):
    result =await db.execute(select(Society).where(Society.id == society_id))
    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society Not exist")

    result = await db.execute(select(Notice).where(Notice.id == notice_id))
    notice_exist = result.scalars().first()

    if not notice_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST ,detail="Notice not exist")

    await db.delete(notice_exist)
    await db.commit()

    return {"message" : "Delete succesfully"}


#endregion

#region events 

@router.post("/{society_id}/events",response_model=EventPrivateResponse,status_code=status.HTTP_201_CREATED,tags=["Event"])
async def create_event(society_id:int,event_data:EventCreate , db:Annotated[AsyncSession,Depends(get_db)]):
    result =await db.execute(select(Society).where(Society.id == event_data.societyid))
    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society Not exist")

    result =await db.execute(select(User).where(User.id == event_data.userid , func.lower(User.role) == "admin"))
    user_exist = result.scalars().first()

    if not user_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="User not exist")

    result = await db.execute(select(Event).where(func.lower(Event.title) == event_data.title.lower()))
    event_exist = result.scalars().first()

    if event_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Title is already exist")

    
    new_event=Event(
        title = event_data.title,
        startdt=event_data.startdt,
        enddt=event_data.enddt,
        allday = event_data.allday,
        description = event_data.description,
        societyid = society_id,
        userid = event_data.userid,
    )

    db.add(new_event)
    await db.commit()
    await db.refresh(new_event)

    new_event.author = user_exist 

    return new_event

@router.get("/{society_id}/events",tags=["Event"])
async def get_all_events(society_id:int,db:Annotated[AsyncSession,Depends(get_db)]) -> list[EventPublicResponse]:
    result =await db.execute(select(Society).where(Society.id == society_id))
    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society Not exist")

    result = await db.execute(select(Event).options(joinedload(Event.author)).where(Event.societyid == society_id))

    return result.scalars().all()

@router.get("/{society_id}/events/{event_id}",status_code=status.HTTP_200_OK,response_model=EventPublicResponse,tags=["Event"])
async def get_event(society_id:int,event_id:int,db:Annotated[AsyncSession,Depends(get_db)]):
    result =await db.execute(select(Society).where(Society.id == society_id))
    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society Not exist")

    result = await db.execute(select(Event).options(joinedload(Event.author)).where(Event.id == event_id))
    event_exist = result.scalars().first()

    if not event_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST ,detail="Event not exist")

    return event_exist

@router.patch("/{society_id}/events/{event_id}",status_code=status.HTTP_200_OK,response_model=EventPrivateResponse,tags=["Event"])
async def update_event(society_id:int,event_id:int,event_data:EventUpdate,current_user:CurrntUser,db:Annotated[AsyncSession,Depends(get_db)]):

    if current_user.role != "Admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="You are unauthorized to update resident")


    
    result =await db.execute(select(Society).where(Society.id == society_id))
    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society Not exist")

    result = await db.execute(select(Event).options(joinedload(Event.author)).where(Event.id == event_id))
    db_event = result.scalars().first()

    if not db_event:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST ,detail="Event not exist")

    update_event_dict = event_data.model_dump(exclude_unset=True)
    
    if not update_event_dict:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided for update")

    for key,value in update_event_dict.items():
        setattr(db_event , key , value)

    await db.commit()
    await db.refresh(db_event)
    
    return db_event


@router.delete("/{society_id}/events/{event_id}",status_code=status.HTTP_200_OK,tags=["Event"])
async def delete_event(society_id:int,event_id:int,current_user:CurrntUser,db:Annotated[AsyncSession,Depends(get_db)]):

    if current_user.role != "Admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="You are unauthorized to update resident")
    
    result =await db.execute(select(Society).where(Society.id == society_id))
    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society Not exist")

    result = await db.execute(select(Event).where(Event.id == event_id))
    event_exist = result.scalars().first()

    if not event_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST ,detail="Event not exist")

    await db.delete(event_exist)
    await db.commit()

    return {"message" : "Delete succesfully"}


#endregion