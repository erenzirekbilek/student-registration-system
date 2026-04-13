package com.v1.backend.util;

import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Objects;

public final class PasswordUtils {

    private PasswordUtils() {}

    public static boolean matches(String rawPassword, String storedPassword, PasswordEncoder encoder) {
        if (storedPassword.startsWith("$2")) {
            return encoder.matches(rawPassword, storedPassword);
        }
        return Objects.equals(rawPassword, storedPassword);
    }
}