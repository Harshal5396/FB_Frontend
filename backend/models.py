from sqlalchemy import Column, Integer, String, Date, DateTime, Numeric
from sqlalchemy.sql import func
from database import Base


class WbRaw(Base):
    __tablename__ = "wb_raw"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    truck_no = Column(String(50))
    date_time_2 = Column(DateTime)
    wt1 = Column(Numeric)
    wt2 = Column(Numeric)
    net_wt = Column(Numeric)
    rst_no = Column(String(50))
    del_no = Column(String(50))
    uploaded_at = Column(DateTime, server_default=func.now())


class Zv07Raw(Base):
    __tablename__ = "zv07_raw"

    id = Column(Integer, primary_key=True, index=True)
    bill_date = Column(Date)
    plant = Column(Integer)
    del_no = Column(String(50))
    distr_channel = Column(String(20))
    truck_no = Column(String(50))
    funct = Column(String(20))
    file_date = Column(Date)
    loaded_at = Column(DateTime, server_default=func.now())


class MergedOutput(Base):
    __tablename__ = "merged_output"

    id = Column(Integer, primary_key=True, index=True)
    bill_date = Column(Date)
    date_time_2 = Column(DateTime)
    plant = Column(Integer)
    distr_channel = Column(String(20))
    funct = Column(String(20))
    status = Column(String(100))
    truck_no = Column(String(50))
    wt2 = Column(Numeric)
    net_wt = Column(Numeric)
    del_no = Column(String(50))
    processed_at = Column(DateTime, server_default=func.now())