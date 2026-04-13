package com.v1.backend.util;

import com.v1.backend.exception.ResourceNotFoundException;
import com.v1.backend.repository.BaseRepository;
import java.util.Optional;

public final class EntityUtils {

    private EntityUtils() {}

    public static <T, ID> T findByIdOrThrow(BaseRepository<T, ID> repository, ID id, String entityName) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(entityName + " not found"));
    }

    public static <T> T orElseThrow(Optional<T> optional, String message) {
        return optional.orElseThrow(() -> new ResourceNotFoundException(message));
    }
}