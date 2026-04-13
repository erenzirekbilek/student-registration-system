package com.v1.backend.factory;

import com.v1.backend.dto.LoginResponseImpl;
import com.v1.backend.dto.UserResponse;
import org.springframework.stereotype.Component;

@Component
public class UserResponseFactoryImpl implements UserResponseFactory {

    @Override
    public UserResponse create(String token, Long id, String name, String email, String role, Long classId) {
        return new LoginResponseImpl(token, id, name, email, role, classId);
    }
}