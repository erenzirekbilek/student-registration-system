package com.v1.backend.config;

import com.v1.backend.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(request -> {
                var config = new org.springframework.web.cors.CorsConfiguration();
                config.setAllowedOrigins(java.util.List.of("http://localhost:5173", "http://localhost:3000"));
                config.setAllowedMethods(java.util.List.of("*"));
                config.setAllowedHeaders(java.util.List.of("*"));
                return config;
            }))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/students/login", "/api/teachers/login").permitAll()
                .requestMatchers("/api/students/check-email", "/api/teachers/check-email").permitAll()
                .requestMatchers("/api/students/**", "/api/teachers/**").permitAll()
                .requestMatchers("/api/courses/**").permitAll()
                .requestMatchers("/api/classes/**").permitAll()
                .requestMatchers("/api/admins/login").permitAll()
                .requestMatchers("/api/admins/**").permitAll()
                .requestMatchers("/api/notices/**").permitAll()
                .requestMatchers("/api/regulations/**").permitAll()
                .requestMatchers("/api/calendar/**").permitAll()
                .requestMatchers("/api/exams/**").permitAll()
                .requestMatchers("/api/ai/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
