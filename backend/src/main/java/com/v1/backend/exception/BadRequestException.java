package com.v1.backend.exception;


public class BadRequestException extends RuntimeException {
    
    private final String operation;   // What caller tried to do
    private final String context;     // Additional details

    public BadRequestException(String userMessage) {
        super(userMessage);
        this.operation = "UNKNOWN";
        this.context = "UNKNOWN";
    }
    

    public BadRequestException(String operation, String userMessage) {
        super(userMessage);
        this.operation = operation;
        this.context = "UNKNOWN";
    }
    

    public BadRequestException(String operation, String context, String userMessage) {
        super(userMessage);
        this.operation = operation;
        this.context = context;
    }
    
    public BadRequestException(String operation, String context, String userMessage, Throwable cause) {
        super(userMessage, cause);
        this.operation = operation;
        this.context = context;
    }
    
    // Accessors for callers
    public String getOperation() { 
        return operation; 
    }
    
    public String getContext() { 
        return context; 
    }
    
    /**
     * Human-readable message for end users.
     * This is safe to show in UI.
     */
    public String getUserMessage() {
        return getMessage();
    }
    
    /**
     * Technical details for developers.
     */
    public String getDeveloperMessage() {
        return String.format("%s [%s]: %s", operation, context, getMessage());
    }
    
    public String getFullMessage() {
        return getMessage();
    }
    
    public String getContextString() {
        return context != null ? context : "";
    }
}