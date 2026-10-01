from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ⚠️ Password: Harshal@5396 → URL encoded: Harshal%405396
DATABASE_URL = "postgresql+psycopg2://postgres:Harshal%405396@localhost:5432/fastapi_db"

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()