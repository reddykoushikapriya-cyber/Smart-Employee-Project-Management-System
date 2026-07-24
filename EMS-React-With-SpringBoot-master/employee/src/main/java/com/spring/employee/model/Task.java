package com.spring.employee.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    
    // Progress as a percentage 0-100
    private Integer progress = 0;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    private String remarks;

    private LocalDate deadline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private Employee assignee;

    public Task() {}

    public Task(String title, String description, ProjectStatus status, LocalDate deadline, Project project, Employee assignee) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.deadline = deadline;
        this.project = project;
        this.assignee = assignee;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public Employee getAssignee() { return assignee; }
    public void setAssignee(Employee assignee) { this.assignee = assignee; }
}
