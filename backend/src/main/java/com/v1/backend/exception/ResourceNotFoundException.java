package com.v1.backend.exception;

public class ResourceNotFoundException extends RuntimeException {
    
    private final String operation;
    private final String resourceType;
    private final Object resourceId;
    
    public ResourceNotFoundException(String message) {
        super(message);
        this.operation = "FIND";
        this.resourceType = "UNKNOWN";
        this.resourceId = null;
    }
    
    public ResourceNotFoundException(String resourceType, Object resourceId) {
        super(String.format("%s with id '%s' not found", resourceType, resourceId));
        this.operation = "FIND";
        this.resourceType = resourceType;
        this.resourceId = resourceId;
    }
    
    public ResourceNotFoundException(String resourceType, Object resourceId, String message) {
        super(message);
        this.operation = "FIND";
        this.resourceType = resourceType;
        this.resourceId = resourceId;
    }
    
    public ResourceNotFoundException(String operation, String resourceType, Object resourceId, String message) {
        super(message);
        this.operation = operation;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
    }
    
    public String getOperation() { return operation; }
    public String getResourceType() { return resourceType; }
    public Object getResourceId() { return resourceId; }
    
    @Override
    public String toString() {
        return String.format("ResourceNotFoundException: Operation=[%s] Type=[%s] Id=[%s] Message=[%s]", 
            operation, resourceType, resourceId, getMessage());
    }
    
    public String getFullMessage() {
        return String.format("Operation '%s' failed: %s with id '%s' not found", 
            operation, resourceType, resourceId);
    }
}