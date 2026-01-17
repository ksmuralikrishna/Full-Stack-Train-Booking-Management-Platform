from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

# User schemas
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    
    class Config:
        from_attributes = True

# Train schemas
class TrainResponse(BaseModel):
    id: int
    name: str
    source: str
    destination: str
    time: str
    total_seats: int
    available_seats: int
    booked_seats: List[int] = []
    
    class Config:
        from_attributes = True

class TrainSearchParams(BaseModel):
    source: Optional[str] = None
    destination: Optional[str] = None
    date: Optional[str] = None
    min_seats: Optional[int] = None
    time_range: Optional[str] = None  # Format: "HH:MM-HH:MM"

# Booking schemas
class BookingCreate(BaseModel):
    train_id: int
    seat_numbers: List[int]
    date: str

class BookingResponse(BaseModel):
    id: int
    user_id: int
    train_id: int
    seat_numbers: List[int]
    date: str
    booking_time: datetime
    train: Optional[TrainResponse] = None
    
    class Config:
        from_attributes = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
