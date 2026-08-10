from typing import Annotated
from fastapi import APIRouter,Depends,status , UploadFile , Form , File
from fastapi.exceptions import HTTPException

from app.config.schemas import SocietyCreate , SocietyPrivateResponse , SocietyPubliResponse , UserPrivateResponse , UserUpdate,SocietyPubliResponse , SocietyPrivateResponse ,UserPublicResponse , MakeSecratery , NoticeCreate,NoticePublicResponse,EventUpdate,NoticePrivateResponse, EventCreate , EventPublicResponse , EventPrivateResponse , PostPublicResponse , PostPrivateResponse , PostCreate , ComplaintPublicResponse , ComplaintCreate ,ComplaintPrivateResponse , ComplaintUpdate ,complaintStats
from app.config.database import get_db
from app.models.model import Society,User,Notice,Event,Post,Complaint
from app.config.auth import CurrntUser
from app.config.config import settings
from app.config.image_utils import process_post_image,delete_post_image,upload_post_image

from sqlalchemy.ext.asyncio import AsyncSession
from starlette.concurrency import run_in_threadpool  ####### note the import
from sqlalchemy import select,func
from sqlalchemy.orm import joinedload

from botocore.exceptions import ClientError,ValidationError

from PIL import UnidentifiedImageError 
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

    if current_user.role.lower() != "admin":
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
async def create_notice(society_id:int,notice_data:NoticeCreate,current_user:CurrntUser , db:Annotated[AsyncSession,Depends(get_db)]):

    
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="You are unauthorized to update resident")


    result =await db.execute(select(Society).where(Society.id == society_id))
    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society Not exist")

    result =await db.execute(select(User).where(User.id == current_user.id , func.lower(User.role) == "admin"))
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
        userid = current_user.id,
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
async def delete_notice(society_id:int,notice_id:int,current_user:CurrntUser,db:Annotated[AsyncSession,Depends(get_db)]):

    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="You are unauthorized to update resident")

    
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
async def create_event(society_id:int,event_data:EventCreate ,current_user:CurrntUser, db:Annotated[AsyncSession,Depends(get_db)]):
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="You are unauthorized to update resident")

    
    result =await db.execute(select(Society).where(Society.id == society_id))
    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society Not exist")

    result =await db.execute(select(User).where(User.id == current_user.id , func.lower(User.role) == "admin"))
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
        userid = current_user.id,
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

    if current_user.role.lower() != "admin":
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

    if current_user.role.lower() != "admin":
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

#region posts 

@router.post("/{society_id}/posts",response_model=PostPrivateResponse,status_code=status.HTTP_201_CREATED,tags=["Posts"])
async def create_post(  
    society_id: int,   
    data: Annotated[str, Form(...)],    
    current_user:CurrntUser,         
    db:Annotated[AsyncSession,Depends(get_db)],
    file: Annotated[UploadFile | None, File()] = None,  
  ):
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="You are unauthorized to update resident")

    
    try:
        post_data = PostCreate.model_validate_json(data)
    except ValidationError as err:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=err.errors(),
        ) from err

    
    result =await db.execute(select(Society).where(Society.id == society_id))
    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society Not exist")

    result =await db.execute(select(User).where(User.id == current_user.id , func.lower(User.role) == "admin"))
    user_exist = result.scalars().first()

    if not user_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="User not exist")

    result = await db.execute(select(Post).where(func.lower(Post.title) == post_data.title.lower()))
    post_exist = result.scalars().first()

    if post_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Title is already exist")

    new_filename = None

    if file:
        content = await file.read()

        if len(content) > settings.max_upload_size_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"File too large. Maximum size is "
                    f"{settings.max_upload_size_bytes // (1024 * 1024)}MB"
                ),
            )

        try:
            processed_bytes, new_filename = await run_in_threadpool(
                process_post_image,
                content,
            )

        except UnidentifiedImageError as err:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image file. Please upload a valid image.",
            ) from err

        try:
            await upload_post_image(
                processed_bytes,
                new_filename,
            )

        except ClientError as err:
            print("S3 ERROR:", err)
            print(
                "S3 ERROR CODE:",
                err.response.get("Error", {}).get("Code"),
            )
            print(
                "S3 ERROR MESSAGE:",
                err.response.get("Error", {}).get("Message"),
            )

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload image",
            ) from err 
        
    new_post=Post(
        title = post_data.title,
        caption = post_data.caption,
        userid = current_user.id,
        societyid = society_id,
        postimagefilename=new_filename,
    )

    db.add(new_post)
    await db.commit()
    await db.refresh(new_post)

    new_post.author = user_exist 
    return new_post

@router.get("/{society_id}/posts",tags=["Post"])
async def get_all_posts(society_id:int,db:Annotated[AsyncSession,Depends(get_db)]) -> list[PostPublicResponse]:
    result =await db.execute(select(Society).where(Society.id == society_id))
    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society Not exist")

    result = await db.execute(select(Post).options(joinedload(Post.author)).where(Post.societyid == society_id))

    return result.scalars().all()

@router.delete("/{society_id}/posts/{post_id}",status_code=status.HTTP_200_OK,tags=["Post"])
async def delete_notice(society_id:int,post_id:int,current_user:CurrntUser,db:Annotated[AsyncSession,Depends(get_db)]):
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="You are unauthorized to update resident")

    
    result =await db.execute(select(Society).where(Society.id == society_id))
    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society Not exist")

    result = await db.execute(select(Post).where(Post.id == post_id))
    post_exist = result.scalars().first()

    if not post_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST ,detail="Post not exist")

    post_image = post_exist.postimagefilename

    await db.delete(post_exist)
    await db.commit()

    if post_image:
        await delete_post_image(post_image)

    return {"message" : "Delete succesfully"}


#endregion

#region complaints



@router.post("/{society_id}/complaints",response_model=ComplaintPrivateResponse,status_code=status.HTTP_201_CREATED,tags=["Complaints"])
async def create_complaint(  
    society_id: int,   
    complaint_data: ComplaintCreate,    
    current_user:CurrntUser,         
    db:Annotated[AsyncSession,Depends(get_db)],
  ):
    result =await db.execute(select(Society).where(Society.id == society_id))
    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society Not exist")

    result =await db.execute(select(User).where(User.id == current_user.id))
    user_exist = result.scalars().first()

    if not user_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="User not exist")
        
    new_complaint=Complaint(
        residentname = current_user.username,
        title = complaint_data.title,
        description = complaint_data.description,
        block = current_user.block,
        flatno = current_user.flatno,

        userid = current_user.id,
        societyid = society_id,
    )

    db.add(new_complaint)
    await db.commit()
    await db.refresh(new_complaint)

    new_complaint.user = user_exist 
    return new_complaint

@router.get("/{society_id}/complaints",tags=["Complaints"])
async def get_all_complaints(society_id:int,current_user:CurrntUser,db:Annotated[AsyncSession,Depends(get_db)]) -> list[ComplaintPublicResponse]:
    result =await db.execute(select(Society).where(Society.id == society_id))
    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society Not exist")

    if current_user.role.lower() == "admin":
        result = await db.execute(select(Complaint).options(joinedload(Complaint.user)).where(Complaint.societyid == society_id))
    
        return result.scalars().all()
    else:
        result = await db.execute(select(Complaint).options(joinedload(Complaint.user)).where(Complaint.societyid == society_id , Complaint.userid == current_user.id))

        return result.scalars().all()


@router.get("/{society_id}/complaints/stats",status_code=status.HTTP_200_OK,response_model=complaintStats,tags=["Complaints"])
async def get_complaint_states(society_id:int,db:Annotated[AsyncSession,Depends(get_db)]):

    result =await db.execute(select(Society).where(Society.id == society_id))
    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society Not exist")

    stats = {
        "total":0,
        "in_progress":0,
        "pending":0,
        "solved":0,
        "blockA":0,
        "blockB":0,
    }

    result = await db.execute(select(Complaint).where(Complaint.societyid == society_id))

    all_complaints = result.scalars().all()

    stats["total"] = len(all_complaints)

    for complaint in all_complaints:
        if complaint.block.lower() == "a":
            stats["blockA"] = stats["blockA"] + 1
        elif complaint.block.lower() == "b":
            stats["blockB"] = stats["blockB"] + 1

        stats[complaint.status.lower()] = stats[complaint.status.lower()] + 1  

    return stats

@router.patch("/{society_id}/complaints/{complaint_id}",status_code=status.HTTP_200_OK,response_model=ComplaintPrivateResponse,tags=["Complaints"])
async def update_complaint(society_id:int,complaint_id:int,complaint_data:ComplaintUpdate,current_user:CurrntUser,db:Annotated[AsyncSession,Depends(get_db)]):

    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="You are unauthorized to update complaint")
    
    
    result =await db.execute(select(Society).where(Society.id == society_id))
    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society Not exist")

    result = await db.execute(select(Complaint).options(joinedload(Complaint.user)).where(Complaint.id == complaint_id))
    db_complaint = result.scalars().first()

    if not db_complaint:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST ,detail="Complaint not exist")

    update_complaint_dict = complaint_data.model_dump(exclude_unset=True)
    
    if not update_complaint_dict:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided for update")

    for key,value in update_complaint_dict.items():
        setattr(db_complaint , key , value)

    await db.commit()
    await db.refresh(db_complaint)
    
    return db_complaint


@router.delete("/{society_id}/complaints/{complaint_id}",status_code=status.HTTP_200_OK,tags=["Complaints"])
async def delete_complaint(society_id:int,complaint_id:int,current_user:CurrntUser,db:Annotated[AsyncSession,Depends(get_db)]):
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="You are unauthorized to update complaint")
    
    result =await db.execute(select(Society).where(Society.id == society_id))
    society_exist = result.scalars().first()

    if not society_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Society Not exist")

    result = await db.execute(select(Complaint).where(Complaint.id == complaint_id))
    complaint_exist = result.scalars().first()

    if not complaint_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST ,detail="Complaint not exist")

    await db.delete(complaint_exist)
    await db.commit()

    return {"message" : "Delete succesfully"}


#endregion