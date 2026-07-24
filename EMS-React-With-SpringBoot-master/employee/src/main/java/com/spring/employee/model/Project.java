package com.spring.employee.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    private LocalDate deadline;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "project_employees",
        joinColumns = @JoinColumn(name = "project_id"),
        inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    private Set<Employee> employees = new HashSet<>();

    public Project() {}

    public Project(String name, String description, ProjectStatus status, Priority priority, LocalDate deadline) {
        this.name = name;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.deadline = deadline;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }
    
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    
    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public Set<Employee> getEmployees() { return employees; }
    public void setEmployees(Set<Employee> employees) { this.employees = employees; }
}
