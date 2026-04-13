package com.v1.backend.util;

import com.v1.backend.exception.ResourceNotFoundException;
import java.util.Optional;

public final class EntityUtils {

    private EntityUtils() {}

    public static <T, ID> T findByIdOrThrow(Optional<T> optional, String message) {
        return optional.orElseThrow(() -> new ResourceNotFoundException(message));
    }

    public static <T> T orElseThrow(Optional<T> optional, String message) {
        return optional.orElseThrow(() -> new ResourceNotFoundException(message));
    }
}