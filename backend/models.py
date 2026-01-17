from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    
    # Relationship
    bookings = relationship("Booking", back_populates="user")

class Train(Base):
    __tablename__ = "trains"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    source = Column(String(100), nullable=False)
    destination = Column(String(100), nullable=False)
    time = Column(String(10), nullable=False)  # Format: "HH:MM"
    total_seats = Column(Integer, nullable=False)  # Total seats in train
    
    # Relationship
    bookings = relationship("Booking", back_populates="train")
    
    @property
    def available_seats(self):
        """Calculate available seats for a specific date"""
        # This will be calculated dynamically in the API
        return self.total_seats

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    train_id = Column(Integer, ForeignKey("trains.id"), nullable=False)
    seat_numbers = Column(String(255), nullable=False)  # JSON string of seat numbers
    date = Column(String(10), nullable=False)  # Format: "YYYY-MM-DD"
    booking_time = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="bookings")
    train = relationship("Train", back_populates="bookings")

