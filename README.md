# Student Registration System

A full-stack student management system with Spring Boot backend and React frontend.

## Features

- Student login and registration
- Teacher login and registration
- Class management
- Course management
- Student dashboard
- Teacher dashboard

## Tech Stack

- **Backend**: Spring Boot, PostgreSQL
- **Frontend**: React, Redux Toolkit, Tailwind CSS, Vite
- **Database**: PostgreSQL

## Setup

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL

### Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `POST /api/students` - Register student
- `POST /api/students/login` - Student login
- `POST /api/teachers` - Register teacher
- `POST /api/teachers/login` - Teacher login
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create class

## License

MIT