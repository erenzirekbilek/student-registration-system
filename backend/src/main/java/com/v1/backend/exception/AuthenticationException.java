package com.v1.backend.exception;

public class AuthenticationException extends RuntimeException {
    
    private final String operation;
    private final String reason;
    
    public AuthenticationException(String message) {
        super(message);
        this.operation = "AUTHENTICATE";
        this.reason = "UNKNOWN";
    }
    
    public AuthenticationException(String operation, String reason, String message) {
        super(message);
        this.operation = operation;
        this.reason = reason;
    }
    
    public AuthenticationException(String operation, String reason, String message, Throwable cause) {
        super(message, cause);
        this.operation = operation;
        this.reason = reason;
    }
    
    public String getOperation() { return operation; }
    public String getReason() { return reason; }
    
    @Override
    public String toString() {
        return String.format("AuthenticationException: Operation=[%s] Reason=[%s] Message=[%s]", 
            operation, reason, getMessage());
    }
    
    public String getFullMessage() {
        return String.format("Authentication failed during '%s': %s (reason: %s)", 
            operation, getMessage(), reason);
    }
    
    public String getReasonString() {
        return reason != null ? reason : "";
    }
}