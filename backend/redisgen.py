import redis

def create_redis_databases():
    redis_instance = redis.Redis(host=os.environ['REDISHOST'], port=os.environ['REDIS_PORT'])
    redis_instance.execute_command('SELECT', '0')
    redis_instance.execute_command('FLUSHDB')
    redis_instance.execute_command('SELECT', '1')
    redis_instance.execute_command('FLUSHDB')