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
| **Factory** | UserResponseFactory, LoginResponse | Consistent object creation |
| **Abstract Factory** | UserResponse polymorphic objects | Encapsulated creation |
| **Repository** | Spring Data JPA | Data access abstraction |

### 1.3 Abstract Factory Pattern

We use Abstract Factory to create polymorphic objects with encapsulation:

```java
// Interface - public API
public interface UserResponse {
    String getToken();
    Long getId();
    String getName();
    // ...
}

// Private implementation - no one sees this
class LoginResponseImpl implements UserResponse {
    // ...
}

// Factory for creation
@Component
public class UserResponseFactoryImpl implements UserResponseFactory {
    public UserResponse create(...) {
        return new LoginResponseImpl(...);
    }
}
```

**Benefits:**
- No one sees the implementation class
- Easy to change implementation
- Polymorphic objects via interface
- Spring manages the factory

---

## 2.5 Law of Demeter (Object Encapsulation)

Objects should hide their data and expose operations. Don't let other modules know about internal structure:

```java
// BEFORE: Breaks Law of Demeter - knows internal structure
student.setPassword(passwordEncoder.encode(student.getPassword()));
if (student.getPassword().startsWith("$2")) { ... }

// AFTER: Object exposes operations
student.encodePassword(passwordEncoder);
if (student.matchesPassword(rawPassword, passwordEncoder)) { ... }
```

## 2.6 Tell, Don't Ask

Tell objects what to do, don't ask them for their data. Objects are about behavior, not just data containers:

```java
// BEFORE: Asking for data
if (student.getAttendance() >= 10) {
    // do something
}

// AFTER: Telling the object to do it
if (student.hasExcessiveAbsences()) {
    // do something
}
```

**Models as Behavior-Rich Objects:**
```java
public class Student {
    // ===================== DATA ACCESS =====================
    // Minimal getters only for external reads
    
    // ===================== TELL, DON'T ASK =====================
    public void recordAttendance(int sessionsMissed) { ... }
    public void markPresent() { ... }
    public boolean hasExcessiveAbsences() { ... }
    public boolean isAcademicProbation() { ... }
    public void enrollInClass(Long classId) { ... }
    public void assignGrade(String grade) { ... }
    public boolean hasPassed() { ... }
    public String getStatus() { ... }
    public void validateForEnrollment() { ... }
}
```

**Benefits:**
- Business logic stays with the object
- Easy to change rules (one place)
- Testable in isolation
- Self-validating entities

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

*Last Updated: v2.0*