package com.spring.employee;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.spring.employee.service.AuthService;

@CrossOrigin(origins = "http://localhost:5173") // CORS for frontend
@SpringBootApplication
public class EmployeeApplication {

    // Logger for the application
    private static final Logger logger = LoggerFactory.getLogger(EmployeeApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(EmployeeApplication.class, args);
        logger.info("Employee application started successfully!");
    }

    @Bean
    public CommandLineRunner seedAdminUser(AuthService authService) {
        return args -> {
            String adminEmail = "admin@example.com";
            String adminPassword = "Admin123!";
            try {
                authService.register(adminEmail, adminPassword, "admin");
                logger.info("Default admin user created: {}", adminEmail);
            } catch (RuntimeException e) {
                logger.info("Default admin user already exists: {}", adminEmail);
            }
        };
    }
}
