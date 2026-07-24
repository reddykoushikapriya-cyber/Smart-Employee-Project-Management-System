package com.spring.employee.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.spring.employee.model.Employee;
import com.spring.employee.security.JwtUtil;
import com.spring.employee.service.EmployeeService;
import com.spring.employee.service.AuthService;
import com.spring.employee.dto.AuthRequest;
import com.spring.employee.dto.RegisterRequest;
import com.spring.employee.dto.ResetPasswordRequest;
import com.spring.employee.dto.AuthResponse;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RestController
@RequestMapping("/ems")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping({"", "/"})
    public String root() {
        return "Employee Management System API";
    }

    @GetMapping("/home")
    private String home() {
        return "Welcome To Employee Management System";
    }

    @GetMapping("/EmployeeDetail")
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }
    
    @GetMapping("/search")
    public ResponseEntity<org.springframework.data.domain.Page<Employee>> searchEmployees(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String department,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(employeeService.searchEmployees(query, department, org.springframework.data.domain.PageRequest.of(page, size)));
    }

    @GetMapping("EmployeeDetail/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);
        return employee.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/AddEmployee")
    public Employee createEmployee(@RequestBody Employee employee) {
        return employeeService.saveEmployee(employee);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            authService.register(req.getEmail(), req.getPassword(), req.getRole());
            return ResponseEntity.ok().body("registered");
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && msg.toLowerCase().contains("already")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(msg);
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        try {
            var user = authService.authenticate(req);
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
            return ResponseEntity.ok(new AuthResponse(token, user.getRole().name()));
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && msg.toLowerCase().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req.getEmail(), req.getNewPassword());
        return ResponseEntity.ok().body("password-reset");
    }

    @PutMapping("/UpdateEmployee/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails) {
        Optional<Employee> employeeOptional = employeeService.getEmployeeById(id);
        if (employeeOptional.isPresent()) {
            Employee employee = employeeOptional.get();
            employee.setFirstname(employeeDetails.getFirstname());
            employee.setLastname(employeeDetails.getLastname());
            employee.setEmail(employeeDetails.getEmail());
            Employee updatedEmployee = employeeService.saveEmployee(employee);
            return ResponseEntity.ok(updatedEmployee);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/DeleteEmployee/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}
