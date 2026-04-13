package com.v1.backend.dto;

public class LoginResponse implements UserResponse {
    private final String token;
    private final Long id;
    private final String name;
    private final String email;
    private final String role;
    private final Long classId;

    public LoginResponse(String token, Long id, String name, String email, String role, Long classId) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.classId = classId;
    }

    public String getToken() { return token; }
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public Long getClassId() { return classId; }

    public static UserResponse of(String token, Long id, String name, String email, String role, Long classId) {
        return new LoginResponse(token, id, name, email, role, classId);
    }
}