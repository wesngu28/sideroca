import redis
import os
from dotenv import load_dotenv 

load_dotenv()
def create_redis():
  return redis.ConnectionPool(
    host='localhost', 
    port=6379,
    password=os.environ['REDISPASSWORD'] if 'REDISPASSWORD' in os.environ else '',
    db=0, 
    decode_responses=True
  )

pool = create_redis()