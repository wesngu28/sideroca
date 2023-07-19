from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv 

load_dotenv()
SQLALCHEMY_DATABASE_URL = os.environ['DATABASE_URL']

if 'sqlite' in database_url:
    engine = create_engine(database_url, connect_args={'check_same_thread': False} )
else:
    engine = create_engine(database_url, connect_args={})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()