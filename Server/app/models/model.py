from __future__ import annotations

from app.config.database import Base
from app.config.config import settings
from sqlalchemy.orm import Mapped,mapped_column,relationship
from sqlalchemy import DateTime,Integer,String,Boolean ,ForeignKey
from pathlib import Path

from datetime import datetime,UTC,timedelta


APP_DIR = Path(__file__).resolve().parent.parent


class Society(Base):
    __tablename__="society"

    id:Mapped[int] = mapped_column(Integer , primary_key=True , index=True)
    societyname:Mapped[str] = mapped_column(String(50) , unique=True , nullable=False)
    address:Mapped[str] = mapped_column(String(300),nullable=False)

    #relations
    residents:Mapped[list["User"]] = relationship(back_populates="society",cascade="all, delete-orphan")
    notices:Mapped[list["Notice"]] = relationship(back_populates="society",cascade="all, delete-orphan")
    events:Mapped[list["Event"]] = relationship(back_populates="society",cascade="all, delete-orphan")
    posts:Mapped[list["Post"]] = relationship(back_populates="society",cascade="all, delete-orphan")
    complaints:Mapped[list["Complaint"]] = relationship(back_populates="society",cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    #user info
    id:Mapped[int] = mapped_column(Integer,primary_key=True,index=True)
    username:Mapped[str] = mapped_column(String(50) ,unique=True , nullable=False)
    email:Mapped[str] = mapped_column(String(120) , unique=True , nullable=False)
    role:Mapped[str] = mapped_column(String(20),nullable=False)
    password_hash:Mapped[str] = mapped_column(String(200) , nullable=False)

    residentname:Mapped[str] = mapped_column(String(30) , nullable=False)
    mobileno:Mapped[str] = mapped_column(String , nullable=False)

    #society info
    societyid:Mapped[int] = mapped_column(ForeignKey("society.id") , nullable=True , index=True)
    block:Mapped[str] = mapped_column(String(1) ,nullable=False)
    flatno:Mapped[int] = mapped_column(Integer , nullable=False)
    #relations
    society:Mapped["Society"] = relationship(back_populates="residents")
    notices:Mapped[list["Notice"]] =  relationship(back_populates="author")
    events:Mapped[list["Event"]] =  relationship(back_populates="author")
    posts:Mapped[list["Post"]] =  relationship(back_populates="author")
    complaints:Mapped[list["Complaint"]] = relationship(back_populates="user")
                                            

class Notice(Base):
    __tablename__="notices"

    id:Mapped[int] = mapped_column(Integer , primary_key=True , index=True)
    societyid:Mapped[int]=mapped_column(ForeignKey("society.id"),nullable=False,index=True)
    userid:Mapped[int]=mapped_column(ForeignKey("users.id"),nullable=False,index=True)
    title:Mapped[str] = mapped_column(String(100) , nullable=False,unique=True)
    content:Mapped[str]=mapped_column(String(500),nullable=False)
    important:Mapped[bool]=mapped_column(Boolean,default=False)
    createdon:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=lambda:datetime.now(UTC))

    #relation
    society:Mapped["Society"] = relationship(back_populates="notices")
    author:Mapped["User"] = relationship(back_populates="notices")


class Event(Base):
    __tablename__="events"

    id:Mapped[int] = mapped_column(Integer , primary_key=True , index=True)
    societyid:Mapped[int]=mapped_column(ForeignKey("society.id"),nullable=False,index=True)
    userid:Mapped[int]=mapped_column(ForeignKey("users.id"),nullable=False,index=True)
    title:Mapped[str] = mapped_column(String(100) , nullable=False,unique=True)
    description:Mapped[str]=mapped_column(String(500),nullable=False)
    allday:Mapped[bool]=mapped_column(Boolean,default=False)
    startdt:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=lambda:datetime.now(UTC))
    enddt:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=lambda:datetime.now(UTC)+timedelta(days=1))
    createdon:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=lambda:datetime.now(UTC))

    #relation
    society:Mapped["Society"] = relationship(back_populates="events")
    author:Mapped["User"] = relationship(back_populates="events")

class Post(Base):
    __tablename__="posts"

    id:Mapped[int] = mapped_column(Integer , primary_key=True , index=True)
    societyid:Mapped[int]=mapped_column(ForeignKey("society.id"),nullable=False,index=True)
    userid:Mapped[int]=mapped_column(ForeignKey("users.id"),nullable=False,index=True)
    title:Mapped[str] = mapped_column(String(100) , nullable=False,unique=True)
    caption:Mapped[str]=mapped_column(String(500),nullable=False)
    postimagefilename:Mapped[str]=mapped_column(String(100),nullable=True)
    createdon:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=lambda:datetime.now(UTC))

    #property :
    @property
    def postimage_path(self) -> str:
        if self.postimagefilename:
            return f"https://{settings.s3_bucket_name}.s3.{settings.s3_region}.amazonaws.com/post_pics/{self.postimagefilename}"
        return f"{APP_DIR}/static/default_post_image.png"

    #relation
    society:Mapped["Society"] = relationship(back_populates="posts")
    author:Mapped["User"] = relationship(back_populates="posts")

class Complaint(Base):
    __tablename__="complaints"

    id:Mapped[int]=mapped_column(Integer , primary_key=True , index=True)
    residentname:Mapped[str]=mapped_column(String(50),nullable=True)
    title:Mapped[str]=mapped_column(String(100) , nullable=False)
    description:Mapped[str]=mapped_column(String(500),nullable=False)
    status:Mapped[str]=mapped_column(String(20),nullable=False,default="pending")
    createdon:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=lambda: datetime.now(UTC))
    comment:Mapped[str]=mapped_column(String(200),nullable=True)

    #user data which doing the complaints
    societyid:Mapped[int]=mapped_column(ForeignKey("society.id"),nullable=False,index=True)
    userid:Mapped[int]=mapped_column(ForeignKey("users.id"),nullable=False,index=True)
    block:Mapped[str]=mapped_column(String(5),nullable=False)
    flatno:Mapped[int]=mapped_column(Integer , nullable=False)

    society:Mapped["Society"]=relationship(back_populates="complaints")
    user:Mapped["User"]=relationship(back_populates="complaints")