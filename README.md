# 🎓 Student Registration System

A modern, full-stack student management system built with Spring Boot (Backend) and React (Frontend).

![GitHub Stars](https://img.shields.io/github/stars/erenzirekbilek/student-registration-system)
![GitHub Forks](https://img.shields.io/github/forks/erenzirekbilek/student-registration-system)
![License](https://img.shields.io/github/license/erenzirekbilek/student-registration-system)

---

## 📋 Features

### For Students
- 📝 Student Registration with class selection
- 🔐 Secure Login with email & password
- 📚 View enrolled courses and classes
- 📊 Personal dashboard with grades & attendance
- 🔔 Update profile information

### For Teachers
- 📝 Teacher Registration system
- 🔐 Secure Login with authentication
- 👥 Manage students
- 📚 Create and manage courses
- 🏫 Class management
- 📊 Dashboard with statistics

### System Features
- 🎨 Modern responsive UI with dark theme
- 🔒 JWT-ready authentication structure
- 📱 Mobile-friendly design
- 🚀 Production-ready structure

---

## 🛠 Tech Stack

### Backend
| Technology | Description |
|------------|-------------|
| Java 17 | Programming Language |
| Spring Boot | Framework |
| PostgreSQL | Database |
| JPA/Hibernate | ORM |

### Frontend
| Technology | Description |
|------------|-------------|
| React 18 | UI Framework |
| Redux Toolkit | State Management |
| Tailwind CSS | Styling |
| Vite | Build Tool |
| React Router | Navigation |

---

## 🚀 Getting Started

### Prerequisites

- **Java**: 17 or higher
- **Node.js**: 18 or higher
- **PostgreSQL**: 14 or higher
- **Maven**: 3.8+

---

### Database Setup

```sql
CREATE DATABASE school_db;
CREATE USER school_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE school_db TO school_user;
```

### Backend Setup

```bash
# Navigate to backend
cd backend

# Update database credentials in src/main/resources/application.properties
# spring.datasource.url=jdbc:postgresql://localhost:5432/school_db
# spring.datasource.username=your_username
# spring.datasource.password=your_password

# Run the application
./mvnw spring-boot:run
```

Backend will start at: `http://localhost:8080`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will start at: `http://localhost:5173`

---

## 📁 Project Structure

```
student-registration-system/
├── backend/
│   ├── src/main/java/com/v1/backend/
│   │   ├── config/         # Configuration files
│   │   ├── controller/    # REST API Controllers
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── model/        # Entity Models
│   │   ├── repository/   # Data Repositories
│   │   └── service/      # Business Logic
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable Components
│   │   ├── pages/        # Page Components
│   │   │   ├── student/  # Student Pages
│   │   │   └── teacher/  # Teacher Pages
│   │   ├── RTK/         # Redux Toolkit Store
│   │   └── App.jsx       # Main App Component
│   └── package.json
│
├── docker-compose.yml       # Docker Compose
└── README.md
```

---

## 🔌 API Endpoints

### Students
| Method | Endpoint | Description |
|-------|----------|-------------|
| POST | `/api/students` | Register new student |
| POST | `/api/students/login` | Student login |
| GET | `/api/students` | Get all students |
| GET | `/api/students/{id}` | Get student by ID |
| PUT | `/api/students/{id}` | Update student |
| DELETE | `/api/students/{id}` | Delete student |

### Teachers
| Method | Endpoint | Description |
|-------|----------|-------------|
| POST | `/api/teachers` | Register new teacher |
| POST | `/api/teachers/login` | Teacher login |
| GET | `/api/teachers` | Get all teachers |
| GET | `/api/teachers/{id}` | Get teacher by ID |
| PUT | `/api/teachers/{id}` | Update teacher |
| DELETE | `/api/teachers/{id}` | Delete teacher |

### Classes
| Method | Endpoint | Description |
|-------|----------|-------------|
| GET | `/api/classes` | Get all classes |
| POST | `/api/classes` | Create new class |
| DELETE | `/api/classes/{id}` | Delete class |

### Courses
| Method | Endpoint | Description |
|-------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| POST | `/api/courses` | Create new course |
| PUT | `/api/courses/{id}` | Update course |
| DELETE | `/api/courses/{id}` | Delete course |

---

## 📸 Screenshots

### Home Page
Modern landing page with Student and Teacher portal options.

### Student Login/Register
Clean form with email and password authentication.

### Teacher Dashboard
Statistics and management tools for teachers.

---

## 🐳 Docker Setup

```bash
# Build and run with Docker
docker-compose up -d
```

---

## 🔧 Environment Variables

### Backend (application.properties)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/school_db
spring.datasource.username=your_username
spring.datasource.password=your_password
server.port=8080
```

---

## 🤝 Contributing

1. Fork the Repository
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Eren Zirekbilek**
- GitHub: [@erenzirekbilek](https://github.com/erenzirekbilek)

---

## 🙏 Acknowledgments

- Spring Boot Documentation
- React Documentation
- Tailwind CSS Documentation
- Redux Toolkit Documentation

---

<p align="center">Made with ❤️ by Eren Zirekbilek</p>