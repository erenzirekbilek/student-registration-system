# AI Service Protocol — Student Management System

> **Scope:** This document defines the integration architecture, role-based behavior, prompt engineering strategy, and data-privacy requirements for embedding an AI assistant (powered by Grok via Groq) into the Student Management System (SMS) using Spring AI and PGVector.

---

## Table of Contents

1. [Overview](#overview)
2. [Role-Based Support (Persona Switching)](#role-based-support-persona-switching)
3. [Three Pillars of Integration](#three-pillars-of-integration)
   - [A. Regulation & Rule Querying (RAG)](#a-regulation--rule-querying-rag)
   - [B. Workflow Guidance](#b-workflow-guidance)
   - [C. Blending Personal Data with Rules](#c-blending-personal-data-with-rules)
4. [Master Prompt Template (Grok)](#master-prompt-template-grok)
5. [UI Placement & Component Design](#ui-placement--component-design)
6. [Data Privacy & KVKK Compliance](#data-privacy--kvkk-compliance)
7. [Implementation Guide](#implementation-guide)
8. [Example Interaction Flows](#example-interaction-flows)
9. [Configuration Reference](#configuration-reference)

---

## Overview

The AI assistant embedded in the Student Management System serves as a **regulation expert and procedural guide** for two distinct user groups: students and teachers. It answers natural-language questions about school regulations, surfaces relevant rule articles, and directs users to the appropriate module or form within the system.

**Technology Stack:**

| Layer | Technology |
|---|---|
| AI Model | Grok (via Groq API - llama3-70b-8192, mixtral-8x7b-32768) |
| AI Framework | Spring AI |
| Vector Store | PGVector (PostgreSQL) |
| Embedding Source | School regulation documents (chunked & vectorized) |
| Backend | Spring Boot |
| Embedding Model | Azure OpenAI or Voyage AI (text-embedding-3-small) |

---

## Role-Based Support (Persona Switching)

The AI dynamically adjusts its communication style based on the authenticated user's role. This is implemented via a **dynamic System Message** in Spring AI, injected at runtime.

### Student Mode — "Guidance" Persona

- Tone: Supportive, explanatory, forward-looking
- Focus: Consequences of rules, deadlines, personal impact
- Goal: Help students understand what a rule means *for them*

**Example response style:**
> "You are approaching the absence limit. You currently have 8 days of absence recorded. The regulation allows a maximum of 10 days (Article 14). I recommend attending all remaining classes. If you have a medical report, submit it to the administration within 3 business days."

### Teacher Mode — "Administrative Support" Persona

- Tone: Technical, procedural, action-oriented
- Focus: Correct procedures, required forms, regulatory references
- Goal: Help teachers execute administrative tasks accurately

**Example response style:**
> "To initiate a disciplinary referral, follow the steps outlined in Article 12 of the Disciplinary Regulation: (1) complete Form DIS-03, (2) obtain the department head's signature, (3) submit to the Vice Principal's office within 5 business days of the incident."

### Spring AI System Message — Dynamic Injection Pattern

```java
String systemMessage = switch (userRole) {
    case STUDENT -> """
        You are an AI assistant for the Student Management System.
        Adopt a GUIDANCE persona: supportive, clear, and focused on the student's personal situation.
        Always reference the relevant article number.
        After answering, guide the student to the relevant module (e.g., Absence Tracker, Exam Schedule).
        Never invent rules. Only use the provided context documents.
        """;
    case TEACHER -> """
        You are an AI assistant for the Student Management System.
        Adopt an ADMINISTRATIVE SUPPORT persona: technical, procedural, and precise.
        Always reference the relevant article number.
        After answering, direct the teacher to the relevant system module (e.g., Grade Entry, Disciplinary Forms).
        Never invent rules. Only use the provided context documents.
        """;
};
```

---

## Three Pillars of Integration

### A. Regulation & Rule Querying (RAG)

Users ask questions in natural language. The system retrieves relevant regulation chunks from PGVector and passes them as context to the model.

**Flow:**

```
User Question
     │
     ▼
Embedding Model (vectorize question)
     │
     ▼
PGVector Similarity Search
     │
     ▼
Top-K Regulation Chunks (context)
     │
     ▼
Grok (System Prompt + Context + Question)
     │
     ▼
Answer with Article Reference
```

**Example:**

- **User:** "What happens if I get a medical report during exam week?"
- **AI Action:** Retrieves chunks tagged `"Health Report"` and `"Make-up Exam"` from PGVector.
- **Response:** "According to Article 9, a medical report must be submitted to the administration within 3 business days of its end date. Make-up exams are typically held on [dates from the academic calendar]. You can view the make-up exam schedule in the **Exam Schedule** module."

**RAG Configuration Tips:**

- Chunk regulation documents by article (one chunk per article or sub-article).
- Include metadata: `article_number`, `section`, `applicability` (student/teacher/both).
- Use metadata filters in PGVector to narrow retrieval based on user role.

---

### B. Workflow Guidance

Beyond answering questions, the AI actively guides users through multi-step administrative processes and suggests the next action within the system.

**Example:**

- **User:** "I want to start a student club. What do I need to do?"
- **AI Action:** Retrieves the club registration procedure from the regulation.
- **Response:** "To register a new student club, follow these steps per Article 22:
  1. Gather at least 10 founding member signatures.
  2. Appoint a faculty advisor.
  3. Submit the **Club Registration Form** to the Student Affairs office.

  👉 [Open Club Registration Form](#) ← *Deep link to the SMS module*"

**Implementation Note:** Deep links are injected as structured data in the AI's response. The frontend renders action buttons from a `actions[]` JSON field returned alongside the text response.

---

### C. Blending Personal Data with Rules

This is the most critical pillar. The AI combines a user's **live personal data** (fetched from the database) with the **general regulation** to give a personalized, actionable answer.

**Flow:**

```
User Question: "How many absences do I have left?"
        │
        ▼
Backend fetches student's current absence count (e.g., 8 days)
        │
        ▼
Backend fetches regulation absence limit via RAG (e.g., 10 days)
        │
        ▼
Both are passed to the AI as part of the prompt context
        │
        ▼
AI generates a personalized, comparative response
```

**Prompt Context Injection Example:**

```
[Student Data — Anonymized]
Current absence count: 8 days
Maximum allowed absences: 10 days (Article 14)

Question: How many absences do I have left?
```

**Response:**
> "You currently have 8 days of absence. The regulation allows a maximum of 10 days (Article 14). You have **2 days remaining**. I strongly recommend careful attendance management for the rest of the semester."

> ⚠️ **See Section 6 (Data Privacy)** for rules on how personal data must be handled before being passed to the AI.

---

## Master Prompt Template (Grok)

The following is the base system prompt to be passed to Grok via Spring AI. Inject the role-specific persona block dynamically (see Role-Based Support section).

```
You are an AI assistant operating within the Student Management System, specializing in school regulations and administrative procedures.

CORE RULES:
1. Never fabricate rules. Only use the regulation excerpts provided in the [CONTEXT] block.
2. Adapt your tone based on the user's role:
   - STUDENT → Guidance persona: supportive, clear, consequence-focused.
   - TEACHER → Administrative Support persona: technical, procedural, step-by-step.
3. Always cite the relevant article number in your response (e.g., "According to Article 7...").
4. After providing an answer, always suggest the relevant system module or next action the user should take.
5. If the context does not contain enough information to answer, say: "I don't have sufficient information in the current regulations to answer this. Please contact the administration directly."
6. Keep responses concise and structured. Use numbered steps for procedures.
7. Do not ask for or acknowledge any personal identifiers (names, ID numbers). Work only with anonymized data labels (e.g., "the student", "current count: X").

[CONTEXT]
{retrieved_regulation_chunks}

[USER DATA — ANONYMIZED]
{anonymized_personal_data}

[USER ROLE]
{role}

[QUESTION]
{user_question}
```

---

## UI Placement & Component Design

### Student Panel

**Component:** "Regulation Assistant" chatbot widget

- **Position:** Fixed bottom-right corner of the student dashboard
- **Trigger:** Floating action button with a book/question-mark icon
- **Behavior:** Opens a slide-up chat panel; persists across navigation within the session
- **Features:**
  - Natural language input
  - Clickable deep-links to relevant modules embedded in responses
  - "Was this helpful?" thumbs up/down feedback button per response

### Teacher Panel

**Component:** "Rule Reminder" contextual assistant

- **Position:** Inline, appears within relevant forms and data-entry screens
- **Triggers:**
  - When entering grades: alerts if a student's grade pattern triggers a regulation rule
  - When recording absences: displays a warning if a student is at or near the absence limit
  - When initiating a disciplinary action: summarizes the required procedure steps

**Example Teacher Alert:**
> ⚠️ *This student has 9 days of absence (limit: 10). Recording this absence will trigger an automatic notification to the student and their guardian per Article 14.*

---

## Data Privacy & KVKK Compliance

Compliance with **KVKK** (Turkey's Personal Data Protection Law, equivalent to GDPR) is mandatory. The following rules govern all data passed to the Grok API.

### Hard Rules

| Rule | Detail |
|---|---|
| **No PII to external APIs** | Never send names, Turkish ID numbers (TC Kimlik No), phone numbers, email addresses, or photos to the Grok API. |
| **Anonymize before sending** | Replace all personal identifiers with neutral labels before constructing the AI prompt. |
| **Minimal data principle** | Send only the data fields strictly necessary to answer the question. |
| **Logging restrictions** | API request logs must not contain personal data. Strip PII before any logging occurs. |
| **Retention** | Do not store AI conversation history in association with a real user identity in external systems. |

### Anonymization Pattern

Before sending any student data to the AI, apply the following transformation at the backend service layer:

**Raw data (never sent externally):**
```json
{
  "studentId": "20230045",
  "studentName": "Ahmet Yılmaz",
  "tcKimlikNo": "12345678901",
  "absenceCount": 8
}
```

**Anonymized prompt context (safe to send):**
```
[Student Data]
Current absence count: 8 days
Maximum allowed absences: 10 days (per Article 14)
```

### Recommended Architecture — Data Anonymization Layer

```
[Student Request]
       │
       ▼
[SMS Backend]
  ├── Fetch personal data from DB (internal only)
  ├── Fetch regulation rule via RAG (PGVector — internal)
  ├── Anonymize: strip all PII, retain only numeric/categorical values
  └── Construct anonymized prompt
       │
       ▼
[Grok API] ← receives only anonymized, non-identifying data
       │
       ▼
[SMS Backend] ← reassembles response with user context
       │
       ▼
[Student's Screen]
```

### KVKK Checklist

- [ ] Data Processing Agreement (DPA) reviewed with xAI (Grok provider)
- [ ] PII anonymization layer implemented and tested
- [ ] API request/response logging excludes personal data
- [ ] Data flow documented in the organization's KVKK register
- [ ] Users informed (via privacy notice) that anonymized queries are processed by a third-party AI service
- [ ] Opt-out mechanism available for AI-assisted features

---

## Implementation Guide

### Phase 1: Dependencies & Configuration

Add these dependencies to `pom.xml`:

```xml
<!-- Spring AI Groq Starter -->
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-groq-spring-boot-starter</artifactId>
    <version>1.0.0-M4</version>
</dependency>

<!-- PGVector Store -->
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-pgvector-store-spring-boot-starter</artifactId>
    <version>1.0.0-M4</version>
</dependency>

<!-- Embedding Model (Azure OpenAI) -->
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
    <version>1.0.0-M4</version>
</dependency>
```

Add to `application.properties`:

```properties
# Groq Configuration
spring.ai.groq.api-key=${GROQ_API_KEY}
spring.ai.groq.chat.options.model=llama3-70b-8192
spring.ai.groq.chat.options.temperature=0.3
spring.ai.groq.chat.options.max-tokens=2048

# Embedding Model (Azure OpenAI for embeddings)
spring.ai.openai.api-key=${AZURE_OPENAI_API_KEY}
spring.ai.openai.embedding.options.model=text-embedding-3-small
spring.ai.openai.embedding.options.dimensions=1536

# PGVector Configuration
spring.ai.vectorstore.pgvector.host=localhost
spring.ai.vectorstore.pgvector.port=5432
spring.ai.vectorstore.pgvector.database=school_db
spring.ai.vectorstore.pgvector.username=postgres
spring.ai.vectorstore.pgvector.password=${DB_PASSWORD}
spring.ai.vectorstore.pgvector.dimensions=1536
spring.ai.vectorstore.pgvector.schema=public

# Optional: Retry & Rate Limiting
spring.ai.retry.max-attempts=3
spring.ai.retry.backoff.initial-interval=1000ms
```

### Phase 2: Database Setup

Enable PGVector extension in PostgreSQL:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Create documents table:

```sql
CREATE TABLE IF NOT EXISTS regulation_documents (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding VECTOR(1536),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ON regulation_documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

### Phase 3: Document Loading Service

Create a service to load and chunk regulation documents:

```java
@Service
public class RegulationDocumentService {

    @Autowired
    private DocumentLoader documentLoader;
    
    @Autowired
    private EmbeddingModel embeddingModel;
    
    @Autowired
    private VectorStore vectorStore;

    public void loadRegulations() {
        // 1. Load regulation documents (PDF, TXT, or DB)
        List<Document> documents = loadDocumentsFromSources();
        
        // 2. Chunk documents by article
        List<Document> chunks = chunkByArticle(documents);
        
        // 3. Add metadata
        chunks.forEach(doc -> doc.getMetadata().put("type", "regulation"));
        
        // 4. Generate embeddings and store in PGVector
        vectorStore.add(chunks);
    }

    private List<Document> loadDocumentsFromSources() {
        // Load from PDF files or database
        // Implementation depends on source format
    }

    private List<Document> chunkByArticle(List<Document> documents) {
        // Split by article numbers: "Article 14", "Article 9.2", etc.
        // Use regex: (?=Article\s+\d+)
    }
}
```

### Phase 4: RAG Service Implementation

```java
@Service
public class RegulationAssistantService {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    public String ask(String question, String role, Map<String, Object> anonymizedStudentData) {
        // 1. Retrieve relevant regulation chunks from PGVector
        List<Document> context = vectorStore.similaritySearch(
            SearchRequest.query(question)
                .withTopK(5)
                .withFilterExpression("applicability == '" + role + "' OR applicability == 'both'")
        );

        // 2. Build dynamic system message based on role
        String systemMessage = buildSystemMessage(role);

        // 3. Build context string from retrieved documents
        String contextText = context.stream()
            .map(Document::getContent)
            .collect(Collectors.joining("\n\n"));

        // 4. Build anonymized data string
        String dataText = formatAnonymizedData(anonymizedStudentData);

        // 5. Call Groq model
        return chatClient.prompt()
            .system(systemMessage)
            .user(buildUserPrompt(contextText, dataText, question))
            .call()
            .content();
    }

    private String buildSystemMessage(String role) {
        return switch (role) {
            case "STUDENT" -> """
                You are an AI assistant for the Student Management System.
                Adopt a GUIDANCE persona: supportive, clear, and focused on the student's personal situation.
                Always reference the relevant article number.
                After answering, guide the student to the relevant module (e.g., Absence Tracker, Exam Schedule).
                Never invent rules. Only use the provided context documents.
                """;
            case "TEACHER" -> """
                You are an AI assistant for the Student Management System.
                Adopt an ADMINISTRATIVE SUPPORT persona: technical, procedural, and precise.
                Always reference the relevant article number.
                After answering, direct the teacher to the relevant system module (e.g., Grade Entry, Disciplinary Forms).
                Never invent rules. Only use the provided context documents.
                """;
            default -> "You are a helpful assistant.";
        };
    }

    private String formatAnonymizedData(Map<String, Object> data) {
        if (data == null || data.isEmpty()) return "No personal data available.";
        
        StringBuilder sb = new StringBuilder("[Personal Data]\n");
        data.forEach((key, value) -> sb.append(key).append(": ").append(value).append("\n"));
        return sb.toString();
    }

    private String buildUserPrompt(String context, String data, String question) {
        return String.format("""
            [CONTEXT]
            %s

            [USER DATA — ANONYMIZED]
            %s

            [QUESTION]
            %s
            """, context, data, question);
    }
}
```

### Phase 5: REST API Controller

```java
@RestController
@RequestMapping("/api/ai")
public class AIAssistantController {

    @Autowired
    private RegulationAssistantService assistantService;

    @Autowired
    private StudentService studentService;

    @PostMapping("/ask")
    public ResponseEntity<Map<String, Object>> ask(
            @RequestBody Map<String, String> request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        String question = request.get("question");
        String role = determineUserRole(authHeader);
        
        // Get personal data (anonymized)
        Map<String, Object> personalData = getAnonymizedData(authHeader, role);
        
        String answer = assistantService.ask(question, role, personalData);
        
        Map<String, Object> response = new HashMap<>();
        response.put("answer", answer);
        response.put("sources", extractArticleReferences(answer));
        
        return ResponseEntity.ok(response);
    }

    private String determineUserRole(String authHeader) {
        // Extract role from JWT token
    }

    private Map<String, Object> getAnonymizedData(String authHeader, String role) {
        if (role.equals("STUDENT")) {
            return studentService.getAnonymizedData(authHeader);
        }
        return Map.of();
    }
}
```

### Phase 6: Error Handling & Fallback

```java
@Service
public class AIServiceFallback {

    public String handleAIError(Exception e) {
        return "I apologize, but I'm currently unable to process your request. " +
               "Please contact the administration directly or try again later. " +
               "For immediate assistance, call: +90 212 XXX XXXX";
    }
}
```

Add to Controller:

```java
@ExceptionHandler(Exception.class)
public ResponseEntity<Map<String, String>> handleException(Exception e) {
    Map<String, String> error = new HashMap<>();
    error.put("error", fallbackService.handleAIError(e));
    return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
}
```

### Phase 7: Initial Data Loading

Create a CommandLineRunner to load regulations on startup:

```java
@Component
public class RegulationLoader implements CommandLineRunner {

    @Autowired
    private RegulationDocumentService documentService;

    @Override
    public void run(String... args) throws Exception {
        // Load sample regulations for demo
        loadSampleRegulations();
    }

    private void loadSampleRegulations() {
        List<Map<String, Object>> samples = List.of(
            Map.of(
                "content", "Article 14: Students are allowed a maximum of 10 days of absence per semester. Exceeding this limit will result in academic probation.",
                "metadata", Map.of("article", "14", "section", "attendance", "applicability", "STUDENT")
            ),
            Map.of(
                "content", "Article 9: Medical reports must be submitted to the administration within 3 business days of the report's end date. Make-up exams are scheduled after the regular examination period.",
                "metadata", Map.of("article", "9", "section", "exams", "applicability", "STUDENT")
            ),
            Map.of(
                "content", "Article 12: To initiate a disciplinary referral, complete Form DIS-03, obtain the department head's signature, and submit to the Vice Principal's office within 5 business days.",
                "metadata", Map.of("article", "12", "section", "discipline", "applicability", "TEACHER")
            )
        );
        
        // Add to vector store
    }
}
```

---

## Spring AI Implementation Notes

### Dependencies (pom.xml)

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-groq-spring-boot-starter</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-pgvector-store-spring-boot-starter</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
</dependency>
```

### RAG Service Skeleton

```java
@Service
public class RegulationAssistantService {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    public String ask(String question, String role, Map<String, Object> anonymizedStudentData) {

        // 1. Retrieve relevant regulation chunks from PGVector
        List<Document> context = vectorStore.similaritySearch(
            SearchRequest.query(question)
                .withTopK(5)
                .withFilterExpression("applicability == '" + role + "' OR applicability == 'both'")
        );

        // 2. Build dynamic system message based on role
        String systemMessage = buildSystemMessage(role);

        // 3. Build context string from retrieved documents
        String contextText = context.stream()
            .map(Document::getContent)
            .collect(Collectors.joining("\n\n"));

        // 4. Build anonymized data string
        String dataText = formatAnonymizedData(anonymizedStudentData);

        // 5. Call Groq model
        return chatClient.prompt()
            .system(systemMessage)
            .user(u -> u.text(buildUserPrompt(contextText, dataText, question)))
            .call()
            .content();
    }
}
```

---

## Example Interaction Flows

### Flow 1 — Student: Absence Query

```
Student: "How many absences do I have left?"

Backend:
  - Fetches absence count: 8
  - Fetches regulation limit via RAG: 10 days (Article 14)
  - Sends anonymized prompt to Grok

AI Response:
  "You currently have 8 days of absence recorded.
   The regulation sets a maximum of 10 days (Article 14).
   You have 2 days remaining. I recommend careful attendance
   management for the remainder of the semester.
   
   👉 View your full attendance record in the Attendance module."
```

---

### Flow 2 — Student: Medical Report During Exams

```
Student: "What happens if I get a medical report during exam week?"

Backend:
  - RAG retrieves: "Health Report" + "Make-up Exam" articles

AI Response:
  "According to Article 9, a medical report must be submitted
   to the administration within 3 business days of its expiry.
   Make-up exams are scheduled after the regular exam period.
   
   👉 Check the Make-up Exam Schedule in the Exam Calendar module."
```

---

### Flow 3 — Teacher: Disciplinary Referral

```
Teacher: "How do I submit a disciplinary referral for a student?"

AI Response:
  "Per Article 12 of the Disciplinary Regulation, follow these steps:
   1. Complete Disciplinary Referral Form (DIS-03).
   2. Obtain the department head's countersignature.
   3. Submit to the Vice Principal's office within 5 business days.
   
   👉 Open Form DIS-03 in the Disciplinary Actions module."
```

---

## Configuration Reference

### Environment Variables (Set in .env or system)

```bash
# Groq API Key (get from https://console.groq.com)
export GROQ_API_KEY=gsk_your_key_here

# Azure OpenAI for Embeddings (or use Groq embedding model)
export AZURE_OPENAI_API_KEY=your_azure_key
export AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com

# Database
export DB_PASSWORD=root123
```

### Rate Limiting Configuration

Groq provides built-in rate limiting. Add application-level control:

```java
@Service
public class RateLimitingService {
    
    private final Map<String, RateLimiter> userLimiters = new ConcurrentHashMap<>();
    
    public boolean isAllowed(String userId) {
        return userLimiters.computeIfAbsent(userId, k -> new RateLimiter(10, Duration.ofMinutes(1)))
            .tryAcquire();
    }
}

@Component
public class RateLimiter {
    private final int maxRequests;
    private final Duration window;
    private final AtomicInteger count = new AtomicInteger();
    private volatile Instant windowStart;
    
    public RateLimiter(int maxRequests, Duration window) {
        this.maxRequests = maxRequests;
        this.window = window;
        this.windowStart = Instant.now();
    }
    
    public boolean tryAcquire() {
        Instant now = Instant.now();
        if (Duration.between(windowStart, now).compareTo(window) > 0) {
            count.set(0);
            windowStart = now;
        }
        return count.incrementAndGet() <= maxRequests;
    }
}
```

### API Key Management

**NEVER commit API keys to Git!**

1. Use environment variables:
```properties
spring.ai.groq.api-key=${GROQ_API_KEY}
```

2. Add to `.gitignore`:
```
.env
*.env
```

3. Create `.env.example`:
```bash
GROQ_API_KEY=your_key_here
AZURE_OPENAI_API_KEY=your_key_here
```

### KVKK Checklist

- [ ] Data Processing Agreement (DPA) reviewed with Groq
- [ ] PII anonymization layer implemented and tested
- [ ] API request/response logging excludes personal data
- [ ] Data flow documented in the organization's KVKK register
- [ ] Users informed (via privacy notice) that anonymized queries are processed by a third-party AI service
- [ ] Opt-out mechanism available for AI-assisted features
- [ ] Rate limiting implemented to prevent abuse
- [ ] Error handling with fallback messages

---

*Document Version: 2.0 | Last Updated: April 2026 | Owner: SMS Integration Team*
