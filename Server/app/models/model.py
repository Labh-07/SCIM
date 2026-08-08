from __future__ import annotations

from app.config.database import Base
from sqlalchemy.orm import Mapped,mapped_column,relationship
from sqlalchemy import DateTime,Integer,String,ForeignKey

class Society(Base):
    __tablename__="society"

    id:Mapped[int] = mapped_column(Integer , primary_key=True , index=True)
    societyname:Mapped[str] = mapped_column(String(50) , unique=True , nullable=False)
    address:Mapped[String] = mapped_column(String(300),nullable=False)

    residents:Mapped[list["User"]] = relationship(back_populates="society",cascade="all , delete-orphan")

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