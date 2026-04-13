# Technical Approach & Code Design

## Overview

This document outlines the technical decisions, architectural patterns, and clean code principles applied in the Student Registration System.

---

## 1. Backend Architecture

### 1.1 Spring Boot Structure

```
backend/src/main/java/com/v1/backend/
├── config/          # Configuration classes (CORS, Security, Jackson)
├── controller/      # REST API endpoints
├── dto/            # Data Transfer Objects
├── exception/      # Custom exceptions & global handler
├── model/          # Entity classes
├── repository/     # Data access layer
├── security/       # JWT authentication
└── service/        # Business logic layer
```

### 1.2 Design Patterns Used

| Pattern | Where Applied | Purpose |
|---------|---------------|---------|
| **MVC** | Controller/Service/Repository | Separation of concerns |
| **Singleton** | Services (@Service) | Single instance per application |
| **Factory** | Entity creation | Consistent object creation |
| **Repository** | Spring Data JPA | Data access abstraction |

---

## 2. Clean Code Principles

### 2.1 Single Responsibility Principle (SRP)

Each service method does one thing:

```java
// BEFORE: login() does everything
public LoginResponse login(String email, String password) {
    return studentRepository.findByEmail(email)
        .filter(s -> matchesPassword(password, s.getPassword()))  // find
        .map(s -> new LoginResponse(...))   // build response
        .orElseThrow(...);                  // error
}

// AFTER: Each method has single responsibility
public LoginResponse login(String email, String password) {
    Student student = findStudentByEmail(email);
    validatePassword(password, student.getPassword());
    return buildLoginResponse(student);
}
```

### 2.2 Constructor Injection

**Before (Field Injection):**
```java
@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;
}
```

**After (Constructor Injection):**
```java
@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
}
```

**Benefits:**
- Immutable dependencies
- Easier testing (mock injection)
- Clear dependencies (compiler enforced)
- Works without Spring container

### 2.3 Method Naming Convention

| Method Type | Naming Pattern | Example |
|-------------|----------------|---------|
| Public API | `VerbNoun` | `getAllStudents()` |
| Private Helper | `verbNoun` | `validatePassword()` |
| Query | `get/find/fetch` | `getStudentById()` |
| Action | `save/update/delete` | `saveStudent()` |
| Validation | `validate/check` | `validateCourseExists()` |

### 2.4 Consistent Error Handling

```java
// Always use custom exceptions
throw new BadRequestException("Email already exists");
throw new ResourceNotFoundException("Course not found");
```

---

## 3. Service Layer Design

### 3.1 Structure Pattern

Every service follows this structure:

```java
@Service
@RequiredArgsConstructor
public class XxxService {
    // Dependencies (final)
    
    // Public methods - API
    public ReturnType publicMethod() { ... }
    
    // Private methods - Implementation details
    private ReturnType helperMethod() { ... }
    private void validationMethod() { ... }
}
```

### 3.2 Validation Layer

Validation logic is extracted to private methods:

```java
private void validateCourseExists(Long courseId) {
    if (!courseRepository.existsById(courseId)) {
        throw new ResourceNotFoundException("Course not found");
    }
}

private void validateNotAlreadyEnrolled(Long studentId, Long courseId) {
    if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
        throw new BadRequestException("Student already enrolled");
    }
}
```

---

## 4. AI Integration (Groq API)

### 4.1 Architecture

```
User → AIChat.jsx → /api/ai/chat → RegulationAssistantService → Groq API
```

### 4.2 Optimization Settings

```java
requestBody.put("temperature", 0.1);   // Lower = more consistent
requestBody.put("top_p", 0.5);         // Controls randomness
requestBody.put("max_tokens", 1024);   // Focused responses
```

### 4.3 System Prompt Strategy

```
- Role-specific prompts (STUDENT vs TEACHER)
- Clear rules for response format
- Constraints to prevent misinformation
```

---

## 5. Frontend Design

### 5.1 Component Structure

```
frontend/src/
├── components/
│   ├── common/     # Reusable (Button, Input, Card, AIChat)
│   └── layout/     # Layout (Navbar, Layout)
├── pages/
│   ├── student/
│   ├── teacher/
│   └── admin/
└── RTK/           # Redux state management
```

### 5.2 State Management

- **Redux Toolkit** for global state
- **Local state** (useState) for component-specific
- **localStorage** for auth tokens

### 5.3 UI Patterns

- Tailwind CSS for styling
- Consistent color system (primary, accent, surface)
- Responsive design with mobile-first

---

## 6. Database Design

### 6.1 Liquibase Migrations

All schema changes are version-controlled:

```
db/changelog/
├── master.xml              # Entry point
└── changesets/
    ├── 001-initial-schema.xml
    ├── 002-seed-data.xml
    └── 003-admin-attendance.xml
```

### 6.2 Key Entities

| Entity | Relationships |
|--------|---------------|
| Student | Many-to-One (SchoolClass) |
| Teacher | One-to-Many (Courses) |
| Course | Many-to-One (Class, Teacher) |
| Enrollment | Many-to-One (Student, Course) |
| Attendance | Many-to-One (Student, Course) |

---

## 7. Security Considerations

### 7.1 Password Handling

- BCrypt encoding for passwords
- Legacy plain-text support for migration
- Password reset with token-based system

### 7.2 JWT (Future Ready)

- JWT service structure in place
- Filter ready for implementation

---

## 8. Best Practices Applied

1. **Don't Repeat Yourself (DRY)** - Common logic extracted to helpers
2. **Keep It Simple, Stupid (KISS)** - Simple, readable code
3. **You Aren't Gonna Need It (YAGNI)** - No over-engineering
4. **Fail Fast** - Validate early, throw exceptions immediately

---

## 9. Performance Optimizations

| Area | Optimization |
|------|-------------|
| AI Responses | Lower temperature (0.1) for stability |
| Database | JPA queries with proper relationships |
| Frontend | Lazy loading, efficient re-renders |

---

## 10. Future Improvements

- [ ] Add service interfaces for better abstraction
- [ ] Implement DTOs for request/response mapping
- [ ] Add caching layer (Redis)
- [ ] Implement full JWT authentication
- [ ] Add unit tests for services

---

*Last Updated: v1.8*