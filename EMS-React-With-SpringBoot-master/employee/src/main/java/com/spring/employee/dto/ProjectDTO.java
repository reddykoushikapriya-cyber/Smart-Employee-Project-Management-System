package com.spring.employee.dto;

import java.time.LocalDate;
import java.util.List;

public class ProjectDTO {
    private Long id;
    private String name;
    private String description;
    private String status;
    private String priority;
    private LocalDate deadline;
    private List<EmployeeDTO> employees;

    public ProjectDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public List<EmployeeDTO> getEmployees() { return employees; }
    public void setEmployees(List<EmployeeDTO> employees) { this.employees = employees; }
}
