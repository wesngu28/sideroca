import redis
import os

def create_redis():
  return redis.ConnectionPool(
    host=os.environ['REDISHOST'], 
    port=os.environ['REDISPORT'], 
    db=0, 
    decode_responses=True
  )

pool = create_redis()