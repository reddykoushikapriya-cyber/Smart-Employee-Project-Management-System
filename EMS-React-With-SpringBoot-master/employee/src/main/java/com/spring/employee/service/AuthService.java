package com.spring.employee.service;

import com.spring.employee.dto.AuthRequest;
import com.spring.employee.model.Role;
import com.spring.employee.model.User;
import com.spring.employee.repository.UserRepository;
import com.spring.employee.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public User register(String email, String password, String roleName) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }
        var role = roleName != null && roleName.equalsIgnoreCase("admin") ? Role.ROLE_ADMIN : Role.ROLE_EMPLOYEE;
        User user = new User(email, passwordEncoder.encode(password), role);
        return userRepository.save(user);
    }

    public User register(String email, String password) {
        return register(email, password, "employee");
    }

    public User authenticate(AuthRequest req) {
        var userOpt = userRepository.findByEmail(req.getEmail());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        var user = userOpt.get();
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        return user;
    }

    public String login(AuthRequest req) {
        var user = authenticate(req);
        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    }

    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
