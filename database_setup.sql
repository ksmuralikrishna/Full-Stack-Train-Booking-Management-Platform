-- Create database
CREATE DATABASE IF NOT EXISTS train_booking;
USE train_booking;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    INDEX idx_email (email)
);

-- Create trains table
CREATE TABLE IF NOT EXISTS trains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    time VARCHAR(10) NOT NULL,
    total_seats INT NOT NULL
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    train_id INT NOT NULL,
    seat_numbers VARCHAR(255) NOT NULL,
    date VARCHAR(10) NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE
);

-- Insert sample trains
INSERT INTO trains (name, source, destination, time, total_seats) VALUES
('Express 101', 'New York', 'Boston', '08:00', 50),
('Express 102', 'Boston', 'New York', '10:30', 50),
('Express 201', 'Chicago', 'Detroit', '09:15', 40),
('Express 202', 'Detroit', 'Chicago', '14:45', 40),
('Express 301', 'Los Angeles', 'San Francisco', '07:30', 60),
('Express 302', 'San Francisco', 'Los Angeles', '16:20', 60),
('Express 401', 'Miami', 'Orlando', '11:00', 35),
('Express 402', 'Orlando', 'Miami', '18:30', 35);

