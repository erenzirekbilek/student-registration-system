package com.v1.backend.dto;

public interface UserResponse {
    String getToken();
    Long getId();
    String getName();
    String getEmail();
    String getRole();
    Long getClassId();
}