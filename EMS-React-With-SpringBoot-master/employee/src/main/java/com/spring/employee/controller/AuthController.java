package com.spring.employee.controller;

import com.spring.employee.dto.*;
import com.spring.employee.model.User;
import com.spring.employee.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        User u = authService.register(req.getEmail(), req.getPassword());
        return ResponseEntity.ok().body("registered");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        String token = authService.login(req);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req.getEmail(), req.getNewPassword());
        return ResponseEntity.ok().body("password-reset");
    }
}
