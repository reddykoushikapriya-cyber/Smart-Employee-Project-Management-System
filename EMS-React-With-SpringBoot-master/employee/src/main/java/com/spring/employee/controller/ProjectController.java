package com.spring.employee.controller;

import com.spring.employee.dto.ProjectDTO;
import com.spring.employee.model.Priority;
import com.spring.employee.model.ProjectStatus;
import com.spring.employee.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
@RestController
@RequestMapping("/ems/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<Page<ProjectDTO>> getProjects(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(projectService.searchProjects(query, status, priority, PageRequest.of(page, size)));
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO projectDTO) {
        return ResponseEntity.ok(projectService.createProject(projectDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id, @RequestBody ProjectDTO projectDTO) {
        return ResponseEntity.ok(projectService.updateProject(id, projectDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/employees/{employeeId}")
    public ResponseEntity<ProjectDTO> assignEmployee(@PathVariable Long id, @PathVariable Long employeeId) {
        return ResponseEntity.ok(projectService.assignEmployee(id, employeeId));
    }

    @DeleteMapping("/{id}/employees/{employeeId}")
    public ResponseEntity<ProjectDTO> removeEmployee(@PathVariable Long id, @PathVariable Long employeeId) {
        return ResponseEntity.ok(projectService.removeEmployee(id, employeeId));
    }
}
