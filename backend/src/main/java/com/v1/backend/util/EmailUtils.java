package com.v1.backend.util;

import java.util.regex.Pattern;

public final class EmailUtils {

    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private EmailUtils() {}

    public static boolean isValid(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    public static void requireValid(String email, String message) {
        if (!isValid(email)) {
            throw new IllegalArgumentException(message);
        }
    }
}