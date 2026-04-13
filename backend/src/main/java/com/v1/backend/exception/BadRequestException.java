package com.v1.backend.exception;

public class BadRequestException extends RuntimeException {
    
    private final String operation;
    private final String context;
    
    public BadRequestException(String message) {
        super(message);
        this.operation = "UNKNOWN";
        this.context = "UNKNOWN";
    }
    
    public BadRequestException(String operation, String message) {
        super(message);
        this.operation = operation;
        this.context = "UNKNOWN";
    }
    
    public BadRequestException(String operation, String context, String message) {
        super(message);
        this.operation = operation;
        this.context = context;
    }
    
    public BadRequestException(String operation, String context, String message, Throwable cause) {
        super(message, cause);
        this.operation = operation;
        this.context = context;
    }
    
    public String getOperation() { return operation; }
    public String getContext() { return context; }
    
    @Override
    public String toString() {
        return String.format("BadRequestException: Operation=[%s] Context=[%s] Message=[%s]", 
            operation, context, getMessage());
    }
    
    public String getFullMessage() {
        return String.format("Operation '%s' failed: %s (context: %s)", 
            operation, getMessage(), context);
    }
}