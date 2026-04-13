package com.v1.backend.service;

import com.v1.backend.exception.BadRequestException;
import com.v1.backend.repository.StudentRepository;
import com.v1.backend.repository.TeacherRepository;
import com.v1.backend.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    
    private final Map<String, ResetToken> resetTokens = new ConcurrentHashMap<>();

    public String requestReset(String email) {
        if (!studentRepository.existsByEmail(email) && 
            !teacherRepository.existsByEmail(email) && 
            !adminRepository.existsByEmail(email)) {
            throw new BadRequestException("Email not found");
        }
        
        String token = UUID.randomUUID().toString();
        resetTokens.put(token, new ResetToken(email, System.currentTimeMillis() + 3600000));
        return token;
    }

    public void resetPassword(String token, String newPassword) {
        ResetToken resetToken = resetTokens.get(token);
        if (resetToken == null || resetToken.expired()) {
            throw new BadRequestException("Invalid or expired token");
        }
        
        String email = resetToken.getEmail();
        
        studentRepository.findByEmail(email).ifPresent(s -> {
            s.setPassword(passwordEncoder.encode(newPassword));
            studentRepository.save(s);
        });
        
        teacherRepository.findByEmail(email).ifPresent(t -> {
            t.setPassword(passwordEncoder.encode(newPassword));
            teacherRepository.save(t);
        });
        
        adminRepository.findByEmail(email).ifPresent(a -> {
            a.setPassword(passwordEncoder.encode(newPassword));
            adminRepository.save(a);
        });
        
        resetTokens.remove(token);
    }

    private static class ResetToken {
        private final String email;
        private final long expiresAt;

        public ResetToken(String email, long expiresAt) {
            this.email = email;
            this.expiresAt = expiresAt;
        }

        public String getEmail() { return email; }
        public boolean expired() { return System.currentTimeMillis() > expiresAt; }
    }
}