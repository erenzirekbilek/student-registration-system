package com.v1.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "teachers")
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(nullable = false, unique = true)
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Column(nullable = false)
    private String password;
    
    private String phone;
    private String specialty;
    private String profileImage;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    // Law of Demeter: Object hides its password data and exposes operations
    String getPassword() { return password; }
    void setPasswordInternal(String password) { this.password = password; }
    
    public void encodePassword(org.springframework.security.crypto.password.PasswordEncoder encoder) {
        this.password = encoder.encode(this.password);
    }
    
    public boolean matchesPassword(String rawPassword, org.springframework.security.crypto.password.PasswordEncoder encoder) {
        if (password.startsWith("$2")) {
            return encoder.matches(rawPassword, password);
        }
        return rawPassword.equals(password);
    }
    
    public void updatePhone(String newPhone) {
        this.phone = newPhone;
    }
    
    public void updateSpecialty(String newSpecialty) {
        this.specialty = newSpecialty;
    }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }
    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}