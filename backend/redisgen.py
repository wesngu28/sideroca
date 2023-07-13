import redis

def create_redis_databases():
    redis_instance = redis.Redis(host='localhost', port=6379)
    
    # Create caching database (DB index 0)
    redis_instance.execute_command('SELECT', '0')
    redis_instance.execute_command('FLUSHDB')

    # Create rate limiting database (DB index 1)
    redis_instance.execute_command('SELECT', '1')
    redis_instance.execute_command('FLUSHDB')

create_redis_databases()