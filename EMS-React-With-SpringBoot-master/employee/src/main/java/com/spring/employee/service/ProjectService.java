package com.spring.employee.service;

import com.spring.employee.dto.ProjectDTO;
import com.spring.employee.dto.EmployeeDTO;
import com.spring.employee.exception.ResourceNotFoundException;
import com.spring.employee.model.Employee;
import com.spring.employee.model.Project;
import com.spring.employee.model.ProjectStatus;
import com.spring.employee.model.Priority;
import com.spring.employee.repository.EmployeeRepository;
import com.spring.employee.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public Page<ProjectDTO> searchProjects(String query, ProjectStatus status, Priority priority, Pageable pageable) {
        return projectRepository.searchProjects(query, status, priority, pageable).map(this::mapToDTO);
    }

    public ProjectDTO createProject(ProjectDTO projectDTO) {
        Project project = new Project();
        project.setName(projectDTO.getName());
        project.setDescription(projectDTO.getDescription());
        project.setStatus(ProjectStatus.valueOf(projectDTO.getStatus()));
        project.setPriority(Priority.valueOf(projectDTO.getPriority()));
        project.setDeadline(projectDTO.getDeadline());

        return mapToDTO(projectRepository.save(project));
    }

    public ProjectDTO updateProject(Long id, ProjectDTO projectDTO) {
        Project project = projectRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        project.setName(projectDTO.getName());
        project.setDescription(projectDTO.getDescription());
        if (projectDTO.getStatus() != null) project.setStatus(ProjectStatus.valueOf(projectDTO.getStatus()));
        if (projectDTO.getPriority() != null) project.setPriority(Priority.valueOf(projectDTO.getPriority()));
        project.setDeadline(projectDTO.getDeadline());
        
        return mapToDTO(projectRepository.save(project));
    }

    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        projectRepository.delete(project);
    }

    public ProjectDTO assignEmployee(Long projectId, Long employeeId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        
        project.getEmployees().add(employee);
        return mapToDTO(projectRepository.save(project));
    }
    
    public ProjectDTO removeEmployee(Long projectId, Long employeeId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        
        project.getEmployees().remove(employee);
        return mapToDTO(projectRepository.save(project));
    }

    private ProjectDTO mapToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        if(project.getStatus() != null) dto.setStatus(project.getStatus().name());
        if(project.getPriority() != null) dto.setPriority(project.getPriority().name());
        dto.setDeadline(project.getDeadline());
        
        dto.setEmployees(project.getEmployees().stream().map(emp -> {
            EmployeeDTO empDto = new EmployeeDTO();
            empDto.setId(emp.getId());
            empDto.setFirstname(emp.getFirstname());
            empDto.setLastname(emp.getLastname());
            empDto.setEmail(emp.getEmail());
            empDto.setDepartment(emp.getDepartment());
            return empDto;
        }).collect(Collectors.toList()));
        return dto;
    }
}
