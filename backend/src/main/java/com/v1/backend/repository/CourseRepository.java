package com.v1.backend.repository;

import com.v1.backend.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByClassId(Long classId);
    List<Course> findByTeacherId(Long teacherId);
}