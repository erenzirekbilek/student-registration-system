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
- ⚙️ Settings page with profile & password management

### For Teachers
- 📝 Teacher Registration system
- 🔐 Secure Login with authentication
- 👥 Manage students
- 📚 Create and manage courses
- 🏫 Class management
- 📊 Dashboard with statistics
- ⚙️ Settings page with profile & password management

### System Features
- 🎨 Modern responsive UI with dark theme
- 🔒 JWT-ready authentication structure
- 📱 Mobile-friendly design
- 🚀 Production-ready structure
- 🔃 Collapsible sidebar navigation
- ✅ CORS configuration for API access

---

## 🛠 Tech Stack

### Backend
| Technology | Description |
|------------|-------------|
| Java 17 | Programming Language |
| Spring Boot | Framework |
| H2/PostgreSQL | Database |
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

## 🔧 Problems We Solved

During development, we encountered and fixed several issues:

### 1. Backend Controller Fixes
- **Problem**: `ResponseEntity.unauthorized()` doesn't exist in Spring
- **Solution**: Changed to `ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()`
- **Files**: `TeacherController.java`, `StudentController.java`

### 2. Null Pointer Exception in Login
- **Problem**: Using `.equals()` directly on passwords could throw NPE if password is null
- **Solution**: Used `Objects.equals()` for safe comparison
- **Files**: `StudentService.java`, `TeacherService.java`

### 3. JSX Parsing Errors
- **Problem**: Unterminated JSX content and missing quotes in strings
- **Solution**: Fixed string quotes and JSX structure in multiple files
- **Files**: `StudentLogin.jsx`, `Classes.jsx`, `StudentAdd.jsx`

### 4. Login State Not Working
- **Problem**: Teacher panel checking for `username` but login passes `email`
- **Solution**: Updated to use correct state variable (`email` instead of `username`)
- **Files**: `TeacherPanel.jsx`

### 5. Undefined Variable
- **Problem**: `department` variable used but not defined
- **Solution**: Changed to use `specialty` which is passed from login
- **Files**: `TeacherPanel.jsx`

### 6. CORS Policy Errors
- **Problem**: Cross-origin requests blocked
- **Solution**: Added global CORS configuration with `CorsConfig.java` and application properties
- **Files**: `CorsConfig.java`, `application.properties`

### 7. H2 Database Configuration
- **Problem**: PostgreSQL not available for testing
- **Solution**: Added H2 in-memory database support with `spring-boot-starter-h2`
- **Files**: `pom.xml`, `application.properties`

### 8. Class List Not Refreshing
- **Problem**: After adding a class, list doesn't update automatically
- **Solution**: Added `refetch()` to manually refresh the class list
- **Files**: `ClassList.jsx`

### 9. JSX Structure Errors (Duplicate Code)
- **Problem**: Duplicate closing tags causing build failures
- **Solution**: Removed duplicate code blocks in both panel files
- **Files**: `TeacherPanel.jsx`, `StudentPanel.jsx`

### 10. Layout Overlap with Topbar
- **Problem**: Sidebar overlapping with top navigation bar
- **Solution**: Changed sidebar to use `top-16` (64px) to start below the navbar
- **Files**: `TeacherPanel.jsx`, `StudentPanel.jsx`

### 11. Collapsible Sidebar
- **Problem**: Fixed sidebar width, needed toggle functionality
- **Solution**: Added `isSidebarOpen` state with smooth transition animation
- **Files**: `TeacherPanel.jsx`, `StudentPanel.jsx`

### 12. Settings Page Missing
- **Problem**: Settings menu item showed "Coming soon..."
- **Solution**: Implemented full settings page with profile info and password change
- **Files**: `TeacherPanel.jsx`, `StudentPanel.jsx`

### 13. Top Bar Icon Cleanup
- **Problem**: Notification and settings icons in header (duplicate with sidebar)
- **Solution**: Removed icons from top bar header, kept only in sidebar
- **Files**: `TeacherPanel.jsx`, `StudentPanel.jsx`

---

## 🚀 Getting Started

### Prerequisites

- **Java**: 17 or higher
- **Node.js**: 18 or higher

---

### Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

Backend will start at: `http://localhost:8080`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will start at: `http://localhost:5173`

---

## 📁 Project Structure

```
student-registration-system/
├── backend/
│   ├── src/main/java/com/v1/backend/
│   │   ├── config/         # Configuration files (CORS)
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

## 🐳 Docker Setup

```bash
# Build and run with Docker
docker-compose up -d
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

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Eren Zirekbilek**
- GitHub: [@erenzirekbilek](https://github.com/erenzirekbilek)

---

<p align="center">Made with ❤️ by Eren Zirekbilek</p>