from sqlalchemy import Column, Integer, String, DateTime, Text
from database import Base
import datetime

MOODS = ["joyful", "calm", "grateful", "sad", "anxious", "angry", "excited", "neutral"]


class Entry(Base):
    __tablename__ = "entries"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False, default="")
    mood = Column(String(20), default="neutral")
    color = Column(String(20), default="coral")
    tags = Column(String(300), default="")
    entry_date = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
    is_favorite = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
