# Train Ticket Booking Application

A full-stack train ticket booking application built with FastAPI (backend), Angular 17+ (frontend), and MySQL (database).

## Features

- **User Authentication**: Register and login with JWT tokens
- **Train Management**: View available trains with schedules
- **Ticket Booking**: Book seats on preferred trains
- **Booking Management**: View and cancel existing bookings
- **Responsive Design**: Modern UI with Bootstrap styling

## Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **PyMySQL**: MySQL database connector
- **bcrypt**: Password hashing
- **python-jose**: JWT token handling

### Frontend
- **Angular 17+**: Modern web framework
- **Bootstrap 5**: CSS framework for responsive design
- **RxJS**: Reactive programming
- **TypeScript**: Type-safe JavaScript

### Database
- **MySQL**: Relational database

## Prerequisites

- Python 3.8+
- Node.js 18+
- MySQL 8.0+
- Angular CLI 17+

## Installation & Setup

### 1. Database Setup

1. Install MySQL and create a database:
```sql
CREATE DATABASE train_booking;
```

2. Run the database setup script:
```bash
mysql -u root -p train_booking < database_setup.sql
```

3. Update database credentials in `backend/database.py`:
```python
DATABASE_URL = "mysql+pymysql://your_username:your_password@localhost:3306/train_booking"
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r ../requirements.txt
```

4. Run the FastAPI server:
```bash
uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the Angular development server:
```bash
npm start
```

The frontend will be available at `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /register` - Register a new user
- `POST /login` - Login and get JWT token

### Trains
- `GET /trains` - Get all available trains

### Bookings (Protected - requires JWT)
- `POST /book` - Book a train ticket
- `GET /bookings` - Get user's bookings
- `DELETE /cancel/{id}` - Cancel a booking

## Usage

1. **Register/Login**: Create an account or login to access booking features
2. **Browse Trains**: View available trains and their schedules
3. **Book Tickets**: Select a train, choose seat number and date
4. **Manage Bookings**: View and cancel your existing bookings

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI application
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   └── schemas.py           # Pydantic schemas
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Angular components
│   │   │   ├── services/    # Angular services
│   │   │   ├── models/      # TypeScript models
│   │   │   ├── guards/      # Route guards
│   │   │   └── interceptors/ # HTTP interceptors
│   │   └── styles.scss      # Global styles
│   └── package.json
├── database_setup.sql       # Database schema and sample data
├── requirements.txt         # Python dependencies
└── README.md
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS configuration for frontend
- Input validation with Pydantic
- Route protection with Angular guards

## Development

### Backend Development
- The FastAPI server runs with auto-reload enabled
- API documentation available at `http://localhost:8000/docs`
- Database changes require restarting the server

### Frontend Development
- Angular development server with hot reload
- TypeScript compilation with strict mode
- Bootstrap components for consistent styling

## Production Deployment

1. **Backend**: Use a production ASGI server like Gunicorn with Uvicorn workers
2. **Frontend**: Build for production with `ng build --prod`
3. **Database**: Use a production MySQL instance with proper security
4. **Security**: Change JWT secret key and database credentials

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.








