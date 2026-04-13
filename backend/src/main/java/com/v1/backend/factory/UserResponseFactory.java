package com.v1.backend.factory;

import com.v1.backend.dto.UserResponse;

public interface UserResponseFactory {
    UserResponse create(String token, Long id, String name, String email, String role, Long classId);
}