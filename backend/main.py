from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from jose import JWTError, jwt
from datetime import datetime, timedelta
import bcrypt
import json
from typing import List, Optional

from database import get_db, engine
from models import Base, User, Train, Booking
from schemas import (
    UserCreate, UserLogin, UserResponse, 
    TrainResponse, BookingCreate, BookingResponse,
    TrainSearchParams, Token, TokenData
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Train Ticket Booking API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200", "http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Configuration
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id)
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == token_data.user_id).first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/login", response_model=Token)
def login_user(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

def get_booked_seats_for_train_date(db: Session, train_id: int, date: str) -> List[int]:
    """Get list of booked seat numbers for a specific train and date"""
    bookings = db.query(Booking).filter(
        and_(Booking.train_id == train_id, Booking.date == date)
    ).all()
    
    booked_seats = []
    for booking in bookings:
        try:
            seat_numbers = json.loads(booking.seat_numbers)
            booked_seats.extend(seat_numbers)
        except json.JSONDecodeError:
            # Handle legacy single seat number format
            booked_seats.append(int(booking.seat_numbers))
    
    return booked_seats

@app.get("/trains", response_model=List[TrainResponse])
def get_trains(
    source: Optional[str] = Query(None, description="Filter by source station"),
    destination: Optional[str] = Query(None, description="Filter by destination station"),
    date: Optional[str] = Query(None, description="Filter by date (YYYY-MM-DD)"),
    min_seats: Optional[int] = Query(None, description="Minimum available seats"),
    time_range: Optional[str] = Query(None, description="Time range (HH:MM-HH:MM)"),
    db: Session = Depends(get_db)
):
    query = db.query(Train)
    
    # Apply filters
    if source:
        query = query.filter(Train.source.ilike(f"%{source}%"))
    if destination:
        query = query.filter(Train.destination.ilike(f"%{destination}%"))
    if time_range:
        start_time, end_time = time_range.split('-')
        query = query.filter(Train.time >= start_time, Train.time <= end_time)
    
    trains = query.all()
    
    # Calculate available seats and booked seats for each train
    result = []
    for train in trains:
        booked_seats = get_booked_seats_for_train_date(db, train.id, date) if date else []
        available_seats = train.total_seats - len(booked_seats)
        
        # Apply min_seats filter
        if min_seats and available_seats < min_seats:
            continue
            
        train_response = TrainResponse(
            id=train.id,
            name=train.name,
            source=train.source,
            destination=train.destination,
            time=train.time,
            total_seats=train.total_seats,
            available_seats=available_seats,
            booked_seats=booked_seats
        )
        result.append(train_response)
    
    return result

@app.post("/book", response_model=BookingResponse)
def book_ticket(booking: BookingCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if train exists
    train = db.query(Train).filter(Train.id == booking.train_id).first()
    if not train:
        raise HTTPException(status_code=404, detail="Train not found")
    
    # Validate seat numbers
    if not booking.seat_numbers or len(booking.seat_numbers) == 0:
        raise HTTPException(status_code=400, detail="At least one seat must be selected")
    
    if any(seat < 1 or seat > train.total_seats for seat in booking.seat_numbers):
        raise HTTPException(status_code=400, detail="Invalid seat numbers")
    
    # Check if seats are available
    booked_seats = get_booked_seats_for_train_date(db, booking.train_id, booking.date)
    unavailable_seats = [seat for seat in booking.seat_numbers if seat in booked_seats]
    
    if unavailable_seats:
        raise HTTPException(
            status_code=400, 
            detail=f"Seats {unavailable_seats} are already booked"
        )
    
    # Create booking
    db_booking = Booking(
        user_id=current_user.id,
        train_id=booking.train_id,
        seat_numbers=json.dumps(booking.seat_numbers),
        date=booking.date
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    
    # Get train details for response
    train = db.query(Train).filter(Train.id == db_booking.train_id).first()
    return BookingResponse(
        id=db_booking.id,
        user_id=db_booking.user_id,
        train_id=db_booking.train_id,
        seat_numbers=booking.seat_numbers,
        date=db_booking.date,
        booking_time=db_booking.booking_time,
        train=train
    )

@app.get("/bookings", response_model=List[BookingResponse])
def get_user_bookings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bookings = db.query(Booking).filter(Booking.user_id == current_user.id).all()
    result = []
    for booking in bookings:
        train = db.query(Train).filter(Train.id == booking.train_id).first()
        try:
            seat_numbers = json.loads(booking.seat_numbers)
        except json.JSONDecodeError:
            # Handle legacy single seat number format
            seat_numbers = [int(booking.seat_numbers)]
        
        result.append(BookingResponse(
            id=booking.id,
            user_id=booking.user_id,
            train_id=booking.train_id,
            seat_numbers=seat_numbers,
            date=booking.date,
            booking_time=booking.booking_time,
            train=train
        ))
    return result

@app.get("/trains/{train_id}/seats")
def get_train_seats(
    train_id: int, 
    date: str = Query(..., description="Date in YYYY-MM-DD format"),
    db: Session = Depends(get_db)
):
    """Get seat availability for a specific train and date"""
    train = db.query(Train).filter(Train.id == train_id).first()
    if not train:
        raise HTTPException(status_code=404, detail="Train not found")
    
    booked_seats = get_booked_seats_for_train_date(db, train_id, date)
    available_seats = [seat for seat in range(1, train.total_seats + 1) if seat not in booked_seats]
    
    return {
        "train_id": train_id,
        "date": date,
        "total_seats": train.total_seats,
        "available_seats": available_seats,
        "booked_seats": booked_seats,
        "available_count": len(available_seats)
    }

@app.delete("/cancel/{booking_id}")
def cancel_booking(booking_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        Booking.user_id == current_user.id
    ).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    db.delete(booking)
    db.commit()
    return {"message": "Booking cancelled successfully"}

@app.get("/")
def read_root():
    return {"message": "Train Ticket Booking API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

