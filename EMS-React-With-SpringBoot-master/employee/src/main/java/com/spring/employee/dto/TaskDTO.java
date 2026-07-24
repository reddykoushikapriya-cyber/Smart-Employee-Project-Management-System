package com.spring.employee.dto;

import java.time.LocalDate;

public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private Integer progress;
    private String status;
    private String remarks;
    private LocalDate deadline;
    private Long projectId;
    private Long assigneeId;
    private EmployeeDTO assignee; // Optional, for display purposes

    public TaskDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public Long getAssigneeId() { return assigneeId; }
    public void setAssigneeId(Long assigneeId) { this.assigneeId = assigneeId; }

    public EmployeeDTO getAssignee() { return assignee; }
    public void setAssignee(EmployeeDTO assignee) { this.assignee = assignee; }
}
