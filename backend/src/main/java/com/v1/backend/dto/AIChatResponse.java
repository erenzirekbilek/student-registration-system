package com.v1.backend.dto;

public class AIChatResponse {
    private String answer;
    private String role;

    public AIChatResponse(String answer, String role) {
        this.answer = answer;
        this.role = role;
    }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
