from fastapi import FastAPI, Depends, Request
from pydantic import BaseModel, create_model
from sqlalchemy import or_, and_, select
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from typing import Union
import redis
from redis import Redis
from cache import pool
import json
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import hashlib
import re
from redisgen import create_redis_databases

models.Base.metadata.create_all(bind=engine)

def get_limiter_key(request: Request):
    current_key = request.scope.get("client")[0]
    request_headers = request.scope.get("headers")
    limiter_prefix = request.scope.get("root_path") + request.scope.get("path") + ":"

    for headers in request_headers:
        if headers[0].decode() == "authorization":
            current_key = headers[1].decode()
            break
        if headers[0].decode() in ("user-agent", "x-real-ip"):
            current_key += headers[1].decode()

    hash_object = hashlib.sha256(current_key.encode())
    current_key = hash_object.hexdigest()
    limiter_key = re.sub(r":{1,}", ":", re.sub(r"/{1,}", ":", limiter_prefix + current_key))
    return limiter_key

limiter = Limiter(key_func=get_limiter_key, storage_uri="redis://localhost:6379/1")
app = FastAPI()
create_redis_databases()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_redis():
  return redis.Redis(connection_pool=pool)

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

@app.get("/cards")
@limiter.limit("30/minute")
async def index(
    request: Request,
    db: Session = Depends(get_db),
    cache: Union[Redis, None] = Depends(get_redis),
    season: int | None = None,
    name: str | None = None,
    type: str | None = None,
    motto: str | None = None,
    category: str | None = None,
    region: str | None = None,
    flag: str | None = None,
    cardcategory: str | None = None,
    badges: str | None = None,
    trophies: str | None = None,
    mode: str | None = None
):
    if all(value is None for value in request.query_params.keys()):
        return {"cards": []}
    cached_response = cache.get(str(request.query_params))
    if cached_response:
        return json.loads(cached_response)
    else:
        sans_queries = []
        or_badges_queries = []
        and_badges_queries = []
        match_queries = []
        for param in request.query_params:
            if (param in ('badges', 'trophies')):
                value = request.query_params[param]
                values = value.split(",") if value else []
                if len(values) == 1 and "sans" in values:
                    sans_queries.append(getattr(models.Card, param) == {})
                else:
                    or_badges = []
                    and_badges = []
                    for value in values:
                        elements = value.split("|")
                        if len(values) == 1:
                            or_badges.extend(elements)
                            break
                        and_badges.append(elements[0])
                        if len(elements) > 1:
                            or_badges.append(elements[1])
                    format_or_badges = [' '.join(word.capitalize() if param == 'badges' else word.upper() for word in badge.split('_')) for badge in or_badges]
                    format_and_badges = [' '.join(word.capitalize() if param == 'badges' else word.upper() for word in badge.split('_')) for badge in and_badges]
                    or_badges_queries = [getattr(models.Card, param).comparator.contains([badge[1:]]) if badge.startswith('!') else getattr(models.Card, param)[badge] for badge in format_or_badges]
                    and_badges_queries = [getattr(models.Card, param).comparator.contains([badge[1:]]) if badge.startswith('!') else getattr(models.Card, param)[badge] for badge in format_and_badges]

            if param in ('name', 'type', 'region', 'flag', 'motto'):
                value = request.query_params[param]
                values = value.split(",") if value else []
                formatted_values = [~getattr(models.Card, param).ilike(f"%{value[1:].replace(' ', '_')}%") if value is not None and value.startswith('!') else getattr(models.Card, param).ilike(f"%{value.replace(' ', '_')}%") if value is not None else True for value in values]
                match_queries.append(or_(*formatted_values) if formatted_values is not None else True)

            if param in ('category', 'cardcategory'):
                value = request.query_params[param]
                values = value.split(",") if value else []
                if param == 'category':
                    values = [' '.join(word.capitalize() for word in value.split('_')) for value in values]
                formatted_values = [~getattr(models.Card, param) == value[1:] if value is not None and value.startswith('!') else getattr(models.Card, param) == value if value is not None else True for value in values]
                match_queries.append(or_(*formatted_values))

        query_finales = db.query(models.Card).filter(
                season is None or models.Card.season == str(season),
                or_(*match_queries) if match_queries is not None else True,
                *sans_queries if sans_queries is not None else True,
                or_(*or_badges_queries) if or_badges_queries is not None else True,
                *and_badges_queries if and_badges_queries is not None else True,
        )

        if (mode):
            res_names = {"cards": [{"id": card.id, "name": card.name} for card in query_finales.with_entities(models.Card.name, models.Card.id).all()]}
            cache.set(str(request.query_params), json.dumps(res_names))
            cache.expire(str(request.query_params), 86400)
            return res_names
        else:
            card_dicts = {"cards": [{key: getattr(card, key) for key in card.__table__.columns.keys()} for card in query_finales.all()] }
            cache.set(str(request.query_params), json.dumps(card_dicts))
            cache.expire(str(request.query_params), 86400)
            return card_dicts
        
# @app.post("/")
# @limiter.limit("15/minute")
# async def index(request: Request, db: Session = Depends(get_db), cache: Union[Redis, None] = Depends(get_redis)):
#     cards_in_collection = await request.json()
#     cached_response = cache.get(str(request.query_params))
#     if cached_response:
#         return json.loads(cached_response)
#     else:
#         query_finales = []
#         for card in cards_in_collection:
#             query = db.query(models.Card).filter(
#                 models.Card.id == card['CARDID'],
#                 models.Card.season == card['SEASON'],
#                 models.Card.cardcategory == card['CATEGORY']
#             )
#             query_finales.extend(query.all())
#         return query_finales