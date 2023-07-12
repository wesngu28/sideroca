from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy import or_
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from typing import Union

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class CardSchema(BaseModel):
    id: int
    season: int
    name: str
    type: str
    motto: str
    category: str
    region: str
    flag: str
    cardcategory: str
    description: str
    badges: Union[list, dict]
    trophies: Union[list, dict]

@app.get("/")
def index(
    db: Session = Depends(get_db),
    season: int | None = None,
    name: str | None = None,
    type: str | None = None,
    motto: str | None = None,
    category: str | None = None,
    region: str | None = None,
    flag: str | None = None,
    cardcategory: str | None = None,
    badges: str | None = None,
    trophies: str | None = None
):
    if all(value is None for value in (season, name, type, motto, category, region, flag, cardcategory, badges, trophies)):
        return {"cards": []}
    
    if season is not None and all(value is None for value in (name, type, motto, category, region, flag, cardcategory, badges, trophies)):
        cards = db.query(models.Card).filter(models.Card.season == str(season)).with_entities(models.Card.name).all()
        return {"cards": [card.name for card in cards]}
    if cardcategory is not None and cardcategory != 'legendary' and all(value is None for value in (name, type, motto, category, region, flag, season, badges, trophies)):
        if cardcategory.startswith('!'):
            cards = db.query(models.Card).filter(~models.Card.SEASON.like(f"%{excluded_season}%")).with_entities(models.Card.NAME).all()
        else:
            cards = db.query(models.Card).filter(models.Card.cardcategory == str(cardcategory)).with_entities(models.Card.name).all()
        return {"cards": [card.name for card in cards]}
    if cardcategory is not None and season is not None and cardcategory != 'legendary' and all(value is None for value in (name, type, motto, category, region, flag, season, badges, trophies)):
        if cardcategory.startswith('!'):
            cards = db.query(models.Card).filter(~models.Card.SEASON.like(f"%{excluded_season}%")).with_entities(models.Card.NAME).all()
        else:
            cards = db.query(models.Card).filter(models.Card.cardcategory == str(cardcategory)).with_entities(models.Card.name).all()
        return {"cards": [card.name for card in cards]}

    badges = badges.split(",") if badges else []
    formatted_badges = [' '.join(word.capitalize() for word in badge.split('_')) for badge in badges]

    trophies = trophies.split(",") if trophies else []
    formatted_trophies = [' '.join(word.upper() for word in trophy.split('_')) for trophy in trophies]

    badges_query = [ models.Card.badges.comparator.contains([badge[1:]]) if badge.startswith('!') else models.Card.badges[badge] for badge in formatted_badges ]
    trophies_query = [ models.Card.trophies.comparator.contains([trophy[1:]]) if trophy.startswith('!') else models.Card.trophies[trophy] for trophy in formatted_trophies ]
    return {"cards": db.query(models.Card).filter(
            season is None or models.Card.season == str(season),
            ~models.Card.name.ilike(f"%{name[1:].replace(' ', '_')}%") if name is not None and name.startswith('!') else models.Card.name.ilike(f"%{name.replace(' ', '_')}%") if name is not None else True,
            ~models.Card.type.ilike(f"%{type[1:].replace(' ', '_')}%") if type is not None and type.startswith('!') else models.Card.type.ilike(f"%{type.replace(' ', '_')}%") if type is not None else True,
            ~models.Card.motto.ilike(f"%{motto[1:].replace(' ', '_')}%") if motto is not None and motto.startswith('!') else models.Card.motto.ilike(f"%{motto.replace(' ', '_')}%") if motto is not None else True,
            ~(models.Card.category == category[1:]) if category is not None and category.startswith('!') else models.Card.category == category if category is not None else True,
            ~models.Card.region.ilike(f"%{region[1:].replace(' ', '_')}%") if region is not None and region.startswith('!') else models.Card.region.ilike(f"%{region.replace(' ', '_')}%") if region is not None else True,
            ~models.Card.flag.ilike(f"%{flag[1:].replace(' ', '_')}%") if flag is not None and flag.startswith('!') else models.Card.flag.ilike(f"%{flag.replace(' ', '_')}%") if flag is not None else True,
            ~(models.Card.cardcategory == cardcategory[1:]) if cardcategory is not None and cardcategory.startswith('!') else models.Card.cardcategory == cardcategory if cardcategory is not None else True,
            *badges_query if badges_query is not None else True,
            *trophies_query if trophies_query is not None else True,
    ).all()}
