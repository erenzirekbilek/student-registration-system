package com.v1.backend.exception;

/**
 * Thrown when a requested resource cannot be found.
 * 
 * CALLEERS PERSPECTIVE:
 * - "I expected X to exist, but it's not there"
 * 
 * NORMAL FLOW:
 * - Resource exists, caller gets it and proceeds
 * 
 * EXCEPTIONAL FLOW (when this is thrown):
 * - Resource doesn't exist (deleted, wrong id, never created)
 * - Caller should check the id and either create or show "not found"
 */
public class ResourceNotFoundException extends RuntimeException {
    
    private final String resourceType;  // What was being looked for
    private final Object resourceId;    // The identifier used
    
    public ResourceNotFoundException(String message) {
        super(message);
        this.resourceType = null;
        this.resourceId = null;
    }
    
    /**
     * Simple: resource not found.
     * 
     * Caller example:
     *   Student s = studentService.getStudent(123);
     *   if (s == null) throw new ResourceNotFoundException("Student", 123);
     */
    public ResourceNotFoundException(String resourceType, Object resourceId) {
        super(String.format("%s not found", resourceType));
        this.resourceType = resourceType;
        this.resourceId = resourceId;
    }
    
    /**
     * Custom message for specific cases.
     * 
     * Caller example:
     *   try {
     *       return studentService.getStudent(123);
     *   } catch (ResourceNotFoundException e) {
     *       log.warn("Cannot update - {}", e.getMessage());
     *       return createDefault();
     *   }
     */
    public ResourceNotFoundException(String resourceType, Object resourceId, String message) {
        super(message);
        this.resourceType = resourceType;
        this.resourceId = resourceId;
    }
    
    public ResourceNotFoundException(String operation, String resourceType, Object resourceId, String message) {
        super(message);
        this.resourceType = resourceType;
        this.resourceId = resourceId;
    }
    
    // Accessors for callers
    public String getResourceType() { 
        return resourceType; 
    }
    
    public Object getResourceId() { 
        return resourceId; 
    }
    
    /**
     * Useful for showing user: "Student #123 not found"
     */
    public String getUserMessage() {
        return getMessage();
    }
    
    /**
     * Useful for logs: "FIND Student failed: id=123"
     */
    public String getDeveloperMessage() {
        return String.format("[%s] lookup failed: id=%s", resourceType, resourceId);
    }
    
    public String getFullMessage() {
        return getMessage();
    }
    
    public String getResourceIdString() {
        return resourceId != null ? resourceId.toString() : "";
    }
}