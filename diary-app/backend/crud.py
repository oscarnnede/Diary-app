from sqlalchemy.orm import Session
from sqlalchemy import or_
import models
import schemas


def create_entry(db: Session, entry: schemas.EntryCreate) -> models.Entry:
    db_entry = models.Entry(**entry.model_dump())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


def get_entry(db: Session, entry_id: int):
    return db.query(models.Entry).filter(models.Entry.id == entry_id).first()


def list_entries(db: Session, search: str | None = None, mood: str | None = None):
    q = db.query(models.Entry)
    if search:
        like = f"%{search}%"
        q = q.filter(or_(models.Entry.title.ilike(like), models.Entry.content.ilike(like)))
    if mood:
        q = q.filter(models.Entry.mood == mood)
    return q.order_by(models.Entry.entry_date.desc()).all()


def update_entry(db: Session, entry_id: int, patch: schemas.EntryUpdate):
    db_entry = get_entry(db, entry_id)
    if not db_entry:
        return None
    data = patch.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(db_entry, key, value)
    db.commit()
    db.refresh(db_entry)
    return db_entry


def delete_entry(db: Session, entry_id: int):
    db_entry = get_entry(db, entry_id)
    if not db_entry:
        return False
    db.delete(db_entry)
    db.commit()
    return True
