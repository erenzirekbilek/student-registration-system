package com.v1.backend.util;

import com.v1.backend.exception.BadRequestException;

public final class ValidationUtils {

    private ValidationUtils() {}

    public static void requireNonNull(Object obj, String message) {
        if (obj == null) {
            throw new BadRequestException(message);
        }
    }

    public static void requireNonBlank(String str, String message) {
        if (str == null || str.isBlank()) {
            throw new BadRequestException(message);
        }
    }

    public static void requireTrue(boolean condition, String message) {
        if (!condition) {
            throw new BadRequestException(message);
        }
    }
}