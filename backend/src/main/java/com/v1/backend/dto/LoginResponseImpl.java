package com.v1.backend.dto;

class LoginResponseImpl implements UserResponse {
    private final String token;
    private final Long id;
    private final String name;
    private final String email;
    private final String role;
    private final Long classId;

    LoginResponseImpl(String token, Long id, String name, String email, String role, Long classId) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.classId = classId;
    }

    @Override
    public String getToken() { return token; }
    @Override
    public Long getId() { return id; }
    @Override
    public String getName() { return name; }
    @Override
    public String getEmail() { return email; }
    @Override
    public String getRole() { return role; }
    @Override
    public Long getClassId() { return classId; }
}