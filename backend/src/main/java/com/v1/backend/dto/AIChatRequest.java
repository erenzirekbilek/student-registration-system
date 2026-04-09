package com.v1.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AIChatRequest {
    @NotBlank(message = "Question is required")
    private String question;
    private String role;

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
