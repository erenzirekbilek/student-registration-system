package com.v1.backend.service;

import com.v1.backend.dto.LoginResponse;
import com.v1.backend.exception.BadRequestException;
import com.v1.backend.exception.ResourceNotFoundException;
import com.v1.backend.model.Admin;
import com.v1.backend.repository.AdminRepository;
import com.v1.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Admin getAdminById(Long id) {
        return adminRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
    }

    public Admin createAdmin(Admin admin) {
        if (adminRepository.existsByEmail(admin.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepository.save(admin);
    }

    public Admin updateAdmin(Long id, Admin admin) {
        Admin existing = getAdminById(id);
        existing.setName(admin.getName());
        existing.setPhone(admin.getPhone());
        if (admin.getPassword() != null && !admin.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(admin.getPassword()));
        }
        return adminRepository.save(existing);
    }

    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }

    public LoginResponse login(String email, String password) {
        return adminRepository.findByEmail(email)
            .filter(a -> passwordEncoder.matches(password, a.getPassword()))
            .map(a -> new LoginResponse(
                jwtService.generateToken(email, "ADMIN"),
                a.getId(),
                a.getName(),
                a.getEmail(),
                "ADMIN",
                null
            ))
            .orElseThrow(() -> new BadRequestException("Invalid email or password"));
    }

    public boolean existsByEmail(String email) {
        return adminRepository.existsByEmail(email);
    }
}