package com.v1.backend.service;

import com.v1.backend.dto.UserResponse;
import com.v1.backend.exception.BadRequestException;
import com.v1.backend.exception.ResourceNotFoundException;
import com.v1.backend.factory.UserResponseFactory;
import com.v1.backend.model.Admin;
import com.v1.backend.repository.AdminRepository;
import com.v1.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserResponseFactory userResponseFactory;

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Admin getAdminById(Long id) {
        return adminRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
    }

    public Admin createAdmin(Admin admin) {
        checkEmailAvailability(admin);
        admin.encodePassword(passwordEncoder);
        return adminRepository.save(admin);
    }

    public Admin updateAdmin(Long id, Admin admin) {
        Admin existing = getAdminById(id);
        existing.setName(admin.getName());
        existing.setPhone(admin.getPhone());
        if (admin.getPassword() != null && !admin.getPassword().isEmpty()) {
            existing.encodePassword(passwordEncoder);
        }
        return adminRepository.save(existing);
    }

    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }

    public UserResponse login(String email, String password) {
        Admin admin = findAdminByEmail(email);
        validatePassword(password, admin);
        return buildLoginResponse(admin);
    }

    public boolean existsByEmail(String email) {
        return adminRepository.existsByEmail(email);
    }

    private void checkEmailAvailability(Admin admin) {
        if (adminRepository.existsByEmail(admin.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
    }

    private Admin findAdminByEmail(String email) {
        return adminRepository.findByEmail(email)
            .orElseThrow(() -> new BadRequestException("Invalid email or password"));
    }

    private void validatePassword(String rawPassword, Admin admin) {
        if (!admin.matchesPassword(rawPassword, passwordEncoder)) {
            throw new BadRequestException("Invalid email or password");
        }
    }

    private UserResponse buildLoginResponse(Admin admin) {
        return userResponseFactory.create(
            jwtService.generateToken(admin.getEmail(), "ADMIN"),
            admin.getId(),
            admin.getName(),
            admin.getEmail(),
            "ADMIN",
            null
        );
    }
}