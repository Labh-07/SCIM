from __future__ import annotations

from app.config.database import Base
from sqlalchemy.orm import Mapped,mapped_column,relationship
from sqlalchemy import DateTime,Integer,String,Boolean ,ForeignKey

from datetime import datetime,UTC,timedelta

class Society(Base):
    __tablename__="society"

    id:Mapped[int] = mapped_column(Integer , primary_key=True , index=True)
    societyname:Mapped[str] = mapped_column(String(50) , unique=True , nullable=False)
    address:Mapped[str] = mapped_column(String(300),nullable=False)

    #relations
    residents:Mapped[list["User"]] = relationship(back_populates="society",cascade="all, delete-orphan")
    notices:Mapped[list["Notice"]] = relationship(back_populates="society",cascade="all, delete-orphan")
    events:Mapped[list["Event"]] = relationship(back_populates="society",cascade="all, delete-orphan")


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