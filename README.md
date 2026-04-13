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
- 📝 Grade and attendance management

### For Admins
- 🔐 Secure Admin login
- 📊 Dashboard with system statistics
- 👥 Manage all students, teachers, courses, classes
- 📈 View analytics and reports

### System Features
- 🎨 Modern responsive UI with light theme (consistent across all pages)
- 📊 Interactive charts and visualizations using Chart.js
- 🔒 JWT-ready authentication structure
- 📱 Mobile-friendly design
- 🚀 Production-ready structure
- 🔃 Collapsible sidebar navigation
- ✅ CORS configuration for API access
- 👨‍💼 Admin panel for centralized management
- 📈 Analytics and dashboard statistics
- 🔐 Password reset functionality
- 🖼️ Profile image upload support
- 📝 Enrollment management for students
- 📅 Attendance tracking system
- 🤖 **AI Assistant** - Groq-powered intelligent chatbot for students & teachers

---

## 🛠 Tech Stack

### Backend
| Technology | Description |
|------------|-------------|
| Java 17 | Programming Language |
| Spring Boot | Framework |
| PostgreSQL | Database |
| JPA/Hibernate | ORM |
| **Liquibase** | **Database Migrations** |
| **Groq API** | **AI Assistant LLM** |

### Frontend
| Technology | Description |
|------------|-------------|
| React 18 | UI Framework |
| Redux Toolkit | State Management |
| Tailwind CSS | Styling |
| **Chart.js** | **Data Visualization** |
| Vite | Build Tool |
| React Router | Navigation |

### AI/ML
| Technology | Description |
|------------|-------------|
| Groq | LLM Inference Platform |
| Qwen Qwen3-32B | Language Model |
| Llama 3.1 70B | Alternative Model | |

---

## 🗄️ Database Migrations (Liquibase)

We use **Liquibase** for managing database schema changes. Here's why and how to use it:

### Why Liquibase?

| Problem | Solution |
|---------|----------|
| **Manual schema changes** are hard to track | Version-controlled XML changelogs |
| **Team coordination** - who changed what? | Every change is a documented changeset |
| **Different environments** - dev/staging/prod | Liquibase tracks what's applied where |
| **Rollback** - need to undo a change? | One command to rollback |
| **Existing database** - how to migrate? | preConditions handle existing tables |

### How It Works

1. **Changelogs**: XML files that describe schema changes
2. **Master.xml**: Links to all changeset files
3. **Changesets**: Individual changes (create table, add column, etc.)
4. **DATABASECHANGELOG table**: Liquibase tracks what's been run

### Project Structure

```
backend/src/main/resources/db/
└── changelog/
    ├── master.xml                    # Main changelog (entry point)
    └── changesets/
        └── 001-initial-schema.xml   # Initial tables
```

### Configuration

In `application.properties`:
```properties
spring.liquibase.change-log=classpath:db/changelog/master.xml
spring.liquibase.enabled=true
spring.jpa.hibernate.ddl-auto=validate  # Don't let Hibernate create tables
```

### Adding New Changes

**1. Create a new changeset file** (`db/changelog/changesets/002-add-column.xml`):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog">
    <changeSet id="002-add-new-column" author="your-name">
        <addColumn tableName="students">
            <column name="new_field" type="VARCHAR(100)"/>
        </addColumn>
    </changeSet>
</databaseChangeLog>
```

**2. Add it to master.xml**:
```xml
<include file="db/changelog/changesets/002-add-column.xml"/>
```

**3. Run the app** - Liquibase runs automatically on startup!

### Existing Database

If you already have a database, don't worry - Liquibase uses `preConditions` to skip creating tables that already exist:
```xml
<preConditions onFail="MARK_RAN">
    <not>
        <tableExists tableName="students"/>
    </not>
</preConditions>
```

This ensures:
- **Existing tables**: Marked as "RAN" (already applied)
- **New tables**: Created normally

### Common Commands

| Command | Description |
|---------|-------------|
| Automatic | Runs on Spring Boot startup |
| `mvn liquibase:update` | Manually run pending changes |
| `mvn liquibase:rollback -Dliquibase.rollbackTag=1.0` | Rollback to tag |
| `mvn liquibase:dropAll` | Drop all tables (use with caution!) |

### Available Changeset Types

- `createTable` - Create new tables
- `addColumn` / `dropColumn` - Modify columns
- `addForeignKeyConstraint` - Add foreign keys
- `createIndex` / `dropIndex` - Manage indexes
- `sql` - Run raw SQL
- And many more in [Liquibase docs](https://docs.liquibase.com/)

---

## 📊 Chart.js Integration

We use **Chart.js** with `react-chartjs-2` for data visualization in the dashboard.

### Installation

Chart.js is already included in the project dependencies:
```json
"chart.js": "^4.5.1",
"react-chartjs-2": "^5.3.1"
```

### Usage Example

```jsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = () => {
  const data = {
    labels: ['Math', 'Science', 'History', 'Art'],
    datasets: [
      {
        label: 'Student Grades',
        data: [85, 92, 78, 88],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Student Performance' },
    },
  };

  return <Bar options={options} data={data} />;
};
```

### Available Chart Types

| Chart | Component | Use Case |
|-------|-----------|----------|
| Bar Chart | `<Bar />` | Compare values across categories |
| Line Chart | `<Line />` | Show trends over time |
| Pie Chart | `<Pie />` | Show distribution/percentages |
| Doughnut | `<Doughnut />` | Show distribution (with hole) |
| Scatter | `<Scatter />` | Show correlation between values |
| Radar | `<Radar />` | Show multi-variable comparison |

---

## 🔍 Knowledge Graph Analysis (Graphify)

We used **Graphify** to automatically extract and visualize the architecture of this codebase. Here's why and what it provides:

### Why Graphify?

| Benefit | What it gives you |
|---------|-------------------|
| **Persistent graph** | Relationships survive sessions - query weeks later without re-reading files |
| **Audit trail** | Every edge tagged EXTRACTED/INFERRED/AMBIGUOUS - you know what's found vs invented |
| **Cross-document surprise** | Community detection finds connections you'd never think to ask about |
| **Visualization** | `graphify-out/graph.html` - interactive browser view, no server needed |
| **Structured data** | `graphify-out/graph.json` - GraphRAG-ready for AI queries |

### When to Use It
- **New codebase** → understand architecture before touching
- **Research corpus** → papers + notes → one navigable graph
- **Personal `/raw` folder** → drop files, query later

### Graph Analysis Results
Our analysis extracted **200 nodes + 209 edges** from 31 files, detecting **24 communities**:

**God Nodes (most connected concepts):**
1. `Student` - 18 edges
2. `Course` - 16 edges
3. `Teacher` - 16 edges
4. `SchoolClass` - 14 edges
5. `React Frontend` - 11 edges
6. `Spring Boot Backend` - 10 edges

**Key Insights:**
- Core entities (Student, Course, Teacher, SchoolClass) form the backbone
- Spring Boot backend and React frontend are clearly separated but connected via API
- 20 isolated nodes found - potential documentation gaps

> Generated automatically with `/graphify` - see `graphify-out/` for full report.

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

### 14. Light Theme Migration
- **Problem**: Inconsistent UI theme across pages (mix of dark/light)
- **Solution**: Updated all pages to use consistent light theme with bg-slate-50, white cards, indigo/violet accents
- **Files**: All page components in `pages/student/` and `pages/teacher/`

### 15. Chart.js Integration
- **Problem**: Need data visualization for dashboards
- **Solution**: Added Chart.js and react-chartjs-2 dependencies for interactive charts
- **Files**: `package.json`, README.md documentation

---

## 💡 Clean Code Approach

### Our Thinking Style

We follow these core principles in our codebase:

| Principle | Description | Implementation |
|-----------|-------------|----------------|
| **Single Responsibility** | Each method does one thing | Service methods split into focused helpers |
| **Constructor Injection** | Dependencies via constructor | `@RequiredArgsConstructor` + `final` fields |
| **Consistent Naming** | Clear, descriptive names | `validateCourseExists()`, `buildLoginResponse()` |
| **Fail Fast** | Validate early | Check conditions before processing |
| **DRY** | Don't repeat yourself | Common logic extracted to helper methods |

### DRY Principle in Action

Every piece of knowledge must have a single, unambiguous, authoritative representation:

```java
// Before: Same logic repeated in 3 services
if (storedPassword.startsWith("$2")) {
    return passwordEncoder.matches(rawPassword, storedPassword);
}
return Objects.equals(rawPassword, storedPassword);

// After: Single source of truth
PasswordUtils.matches(rawPassword, storedPassword, passwordEncoder);
```

**Utility Classes:**
- `PasswordUtils` - Password matching (BCrypt + legacy)
- `ValidationUtils` - Common validation
- `EmailUtils` - Email validation
- `EntityUtils` - Entity finding

### Abstract Factory Pattern

Polymorphic object creation with encapsulation:

```
UserResponse (interface) ← Client sees this
    ↑
UserResponseFactory ← Spring manages
    ↑
LoginResponseImpl (private) ← No one sees this
```

### Law of Demeter

Objects hide their data, expose operations:

```java
// Before (breaks LoD)
student.setPassword(passwordEncoder.encode(student.getPassword()));
if (student.getPassword().startsWith("$2")) { ... }

// After (object encapsulates)
student.encodePassword(passwordEncoder);
if (student.matchesPassword(rawPassword, passwordEncoder)) { ... }
```

### Tell, Don't Ask

Tell objects what to do, don't ask for their data:

```java
// Before: Asking for data
if (student.getAttendance() >= 10) { ... }

// After: Telling object to decide
if (student.hasExcessiveAbsences()) { ... }
```

Models now have business methods: `encodePassword()`, `matchesPassword()`, `recordAttendance()`, `markPresent()`, `enrollInClass()`, `hasPassed()`, `getStatus()`, etc.

**Example in Service:**
```java
// Before (Ask)
student.setAttendance(student.getAttendance() + 1);
if (student.getAttendance() >= 10) { ... }

// After (Tell)
student.recordAttendance(1);
student.validateForEnrollment();
```

### Example: Refactored Login

**Before (Multiple responsibilities):**
```java
public LoginResponse login(String email, String password) {
    return studentRepository.findByEmail(email)
        .filter(s -> matchesPassword(password, s.getPassword()))
        .map(s -> new LoginResponse(...))
        .orElseThrow(() -> new BadRequestException("Invalid credentials"));
}
```

**After (Single responsibility methods):**
```java
public LoginResponse login(String email, String password) {
    Student student = findStudentByEmail(email);
    validatePassword(password, student.getPassword());
    return buildLoginResponse(student);
}
```

### Benefits Achieved

- **Readability**: Each method is self-documenting
- **Testability**: Easy to unit test each method
- **Maintainability**: Changes isolated to specific methods
- **Reusability**: Helper methods can be reused

See `APPROACH.md` for detailed technical documentation.

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
│   │   ├── config/         # Configuration files (CORS, Rate Limit)
│   │   ├── controller/    # REST API Controllers
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── model/        # Entity Models
│   │   ├── repository/   # Data Repositories
│   │   ├── service/      # Business Logic
│   │   └── security/     # JWT Authentication
│   └── src/main/resources/
│       ├── application.properties
│       └── db/                    # Liquibase migrations
│           └── changelog/
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable Components
│   │   ├── pages/        # Page Components
│   │   │   ├── student/  # Student Pages
│   │   │   ├── teacher/  # Teacher Pages
│   │   │   └── admin/    # Admin Pages
│   │   ├── RTK/         # Redux Toolkit Store
│   │   └── App.jsx       # Main App Component
│   └── package.json
│
├── docker-compose.yml       # Docker Compose (Backend + Frontend + PostgreSQL)
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

### Enrollments
| Method | Endpoint | Description |
|-------|----------|-------------|
| GET | `/api/enrollments` | Get all enrollments |
| GET | `/api/enrollments/student/{id}` | Get student enrollments |
| GET | `/api/enrollments/course/{id}` | Get course enrollments |
| POST | `/api/enrollments` | Enroll student in course |
| PUT | `/api/enrollments/{id}/grade` | Update student grade |
| PUT | `/api/enrollments/{id}/attendance` | Update attendance |
| PUT | `/api/enrollments/{id}/unenroll` | Unenroll student |
| DELETE | `/api/enrollments/{id}` | Delete enrollment |

### Attendance
| Method | Endpoint | Description |
|-------|----------|-------------|
| GET | `/api/attendance` | Get all attendance records |
| GET | `/api/attendance/student/{id}` | Get student attendance |
| GET | `/api/attendance/course/{id}` | Get course attendance |
| POST | `/api/attendance` | Mark attendance |

### Admins
| Method | Endpoint | Description |
|-------|----------|-------------|
| POST | `/api/admins/login` | Admin login |
| GET | `/api/admins` | Get all admins |
| GET | `/api/admins/stats` | Get dashboard statistics |
| POST | `/api/admins` | Create admin |
| PUT | `/api/admins/{id}` | Update admin |
| DELETE | `/api/admins/{id}` | Delete admin |

### Authentication
| Method | Endpoint | Description |
|-------|----------|-------------|
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |

### File Upload
| Method | Endpoint | Description |
|-------|----------|-------------|
| POST | `/api/upload/profile` | Upload profile image |

---

## 🐳 Docker Setup

```bash
# Build and run with Docker
docker-compose up -d
```

### Docker Services
| Service | Port | Description |
|---------|------|-------------|
| Frontend | 80 | React app with Nginx |
| Backend | 8080 | Spring Boot API |
| PostgreSQL | 5432 | Database with pgvector |

### Default Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | password123 |
| Teacher | john.smith@school.com | password123 |
| Student | alice.johnson@student.com | password123 |

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

## 🆕 Latest Updates (v2.0)

### New Features Added

1. **Enrollment Management**
   - Students can enroll/unenroll from courses
   - Teachers can manage course enrollments
   - Grade and attendance tracking per enrollment

2. **Attendance Tracking**
   - Daily attendance marking system
   - Track attendance by student, course, or date
   - Notes support for attendance records

3. **Admin Panel**
   - Dedicated admin login at `/admin/login`
   - Dashboard with system statistics
   - Manage all students, teachers, courses, and classes

4. **Password Reset**
   - Token-based password reset system
   - Available for all user types (student, teacher, admin)

5. **Analytics & Reports**
   - Dashboard statistics endpoint
   - Students per class distribution
   - Average grades per course
   - Overall attendance statistics

6. **Profile Image Upload**
   - Upload profile photos for students and teachers
   - API endpoint: `/api/upload/profile`

7. **Rate Limiting**
   - API rate limiting configuration ready
   - 100 requests per minute per client

8. **AI Assistant (Groq Integration)**
   - Intelligent chatbot for students and teachers
   - Context-aware responses using user's personal data
   - Powered by Groq API with Qwen model
   - Handles school regulations, grades, attendance queries

### New Database Tables
- `admins` - Admin users
- `attendance` - Daily attendance records

---

## 🤖 AI Assistant System

The system includes an intelligent AI chatbot powered by **Groq API** to assist students and teachers with administrative queries.

### Architecture

```
User Request → Frontend (AIChat.jsx) → Backend API (/api/ai/chat) → Groq API (LLM)
                                   ↓
                          RegulationAssistantService
                                   ↓
                        Processes & Filters Response
```

### Technology Stack
- **LLM Provider**: Groq API
- **Model**: Qwen Qwen3-32B (or Llama 3.1 70B)
- **Backend**: Spring Boot Service
- **Frontend**: React Component

### Features
- **Context-Aware**: Uses student's personal data (grades, attendance, courses) for personalized responses
- **Role-Based**: Different personas for Students vs Teachers
- **Response Filtering**: Removes thinking/reasoning tags for clean output
- **Real-time Chat**: Interactive chat interface with loading states

### API Endpoint
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Send question to AI assistant |

**Request Headers:**
- `X-User-Id`: Current user ID
- `X-User-Role`: STUDENT, TEACHER, or ADMIN

**Request Body:**
```json
{
  "question": "What is my current attendance?",
  "role": "STUDENT"
}
```

**Response:**
```json
{
  "answer": "Your current attendance is 92%. You have missed 4 out of 50 sessions."
}
```

### Configuration

In `application.properties`:
```properties
groq.api.key=your_groq_api_key_here
```

### Frontend Component
The `AIChat.jsx` component provides:
- Floating chat button
- Minimizable chat panel
- Quick suggestion buttons
- Typing indicator ("AI thinking...")
- Message history
- Responsive design

### Implementation Files
- `RegulationAssistantService.java` - Backend AI service
- `AIChat.jsx` - Frontend chat component
- `AIChatController.java` - API controller

---

<p align="center">Made with ❤️ by Eren Zirekbilek</p>