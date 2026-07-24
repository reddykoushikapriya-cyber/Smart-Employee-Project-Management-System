package com.spring.employee.controller;

import com.spring.employee.model.Task;
import com.spring.employee.model.ProjectStatus;
import com.spring.employee.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
@RestController
@RequestMapping("/ems/reports")
public class ReportController {

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping("/tasks/csv")
    public ResponseEntity<byte[]> getTaskReport() {
        List<Task> tasks = taskRepository.findAll();
        StringBuilder csv = new StringBuilder("ID,Title,Status,Progress,Deadline,Assignee,Project\n");
        
        for (Task t : tasks) {
            String assignee = t.getAssignee() != null ? t.getAssignee().getFirstname() + " " + t.getAssignee().getLastname() : "Unassigned";
            String project = t.getProject() != null ? t.getProject().getName() : "None";
            csv.append(t.getId()).append(",")
               .append(t.getTitle()).append(",")
               .append(t.getStatus()).append(",")
               .append(t.getProgress()).append(",")
               .append(t.getDeadline()).append(",")
               .append(assignee).append(",")
               .append(project).append("\n");
        }

        byte[] csvBytes = csv.toString().getBytes();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "task_report.csv");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(csvBytes);
    }
}
