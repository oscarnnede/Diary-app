from pydantic import BaseModel, field_validator
from typing import Optional
import datetime

VALID_MOODS = {"joyful", "calm", "grateful", "sad", "anxious", "angry", "excited", "neutral"}
VALID_COLORS = {"coral", "amber", "teal", "indigo", "rose", "lime", "sky", "plum"}


class EntryBase(BaseModel):
    title: str
    content: str = ""
    mood: str = "neutral"
    color: str = "coral"
    tags: str = ""
    entry_date: datetime.datetime

    @field_validator("title")
    @classmethod
    def check_title(cls, v):
        if not v or not v.strip():
            raise ValueError("title cannot be empty")
        return v.strip()

    @field_validator("mood")
    @classmethod
    def check_mood(cls, v):
        if v not in VALID_MOODS:
            raise ValueError(f"mood must be one of {VALID_MOODS}")
        return v

    @field_validator("color")
    @classmethod
    def check_color(cls, v):
        if v not in VALID_COLORS:
            raise ValueError(f"color must be one of {VALID_COLORS}")
        return v


class EntryCreate(EntryBase):
    pass


class EntryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    mood: Optional[str] = None
    color: Optional[str] = None
    tags: Optional[str] = None
    entry_date: Optional[datetime.datetime] = None
    is_favorite: Optional[int] = None


class EntryOut(EntryBase):
    id: int
    is_favorite: int
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True
