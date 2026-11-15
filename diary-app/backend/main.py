import time
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session
from sqlalchemy import func

import models
import schemas
import crud
from database import engine, get_db

for attempt in range(10):
    try:
        models.Base.metadata.create_all(bind=engine)
        break
    except OperationalError:
        if attempt == 9:
            raise
        time.sleep(2)

app = FastAPI(title="Diary API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/entries", response_model=schemas.EntryOut)
def create_entry(entry: schemas.EntryCreate, db: Session = Depends(get_db)):
    return crud.create_entry(db, entry)


@app.get("/entries", response_model=List[schemas.EntryOut])
def list_entries(search: Optional[str] = None, mood: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.list_entries(db, search=search, mood=mood)


@app.get("/entries/{entry_id}", response_model=schemas.EntryOut)
def get_entry(entry_id: int, db: Session = Depends(get_db)):
    db_entry = crud.get_entry(db, entry_id)
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return db_entry


@app.patch("/entries/{entry_id}", response_model=schemas.EntryOut)
def update_entry(entry_id: int, patch: schemas.EntryUpdate, db: Session = Depends(get_db)):
    db_entry = crud.update_entry(db, entry_id, patch)
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return db_entry


@app.delete("/entries/{entry_id}")
def delete_entry(entry_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_entry(db, entry_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"deleted": True}


@app.get("/stats/moods")
def mood_stats(db: Session = Depends(get_db)):
    rows = (
        db.query(models.Entry.mood, func.count(models.Entry.id))
        .group_by(models.Entry.mood)
        .all()
    )
    return {mood: count for mood, count in rows}
