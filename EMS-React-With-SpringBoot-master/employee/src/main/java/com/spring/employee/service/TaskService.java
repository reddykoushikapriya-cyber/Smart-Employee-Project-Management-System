package com.spring.employee.service;

import com.spring.employee.dto.TaskDTO;
import com.spring.employee.dto.EmployeeDTO;
import com.spring.employee.exception.ResourceNotFoundException;
import com.spring.employee.model.Employee;
import com.spring.employee.model.Project;
import com.spring.employee.model.ProjectStatus;
import com.spring.employee.model.Task;
import com.spring.employee.repository.EmployeeRepository;
import com.spring.employee.repository.ProjectRepository;
import com.spring.employee.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public Page<TaskDTO> searchTasks(String query, ProjectStatus status, Long assigneeId, Pageable pageable) {
        return taskRepository.searchTasks(query, status, assigneeId, pageable).map(this::mapToDTO);
    }

    public TaskDTO createTask(TaskDTO taskDTO) {
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        if(taskDTO.getStatus() != null) task.setStatus(ProjectStatus.valueOf(taskDTO.getStatus()));
        task.setDeadline(taskDTO.getDeadline());
        
        if (taskDTO.getProjectId() != null) {
            Project project = projectRepository.findById(taskDTO.getProjectId()).orElseThrow(() -> new ResourceNotFoundException("Project not found"));
            task.setProject(project);
        }

        if (taskDTO.getAssigneeId() != null) {
            Employee assignee = employeeRepository.findById(taskDTO.getAssigneeId()).orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
            task.setAssignee(assignee);
        }

        Task savedTask = taskRepository.save(task);

        if (savedTask.getProject() != null) {
            recalculateProjectStatus(savedTask.getProject());
        }

        return mapToDTO(savedTask);
    }

    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        if (taskDTO.getTitle() != null) task.setTitle(taskDTO.getTitle());
        if (taskDTO.getDescription() != null) task.setDescription(taskDTO.getDescription());
        if (taskDTO.getStatus() != null) task.setStatus(ProjectStatus.valueOf(taskDTO.getStatus()));
        if (taskDTO.getProgress() != null) task.setProgress(taskDTO.getProgress());
        if (taskDTO.getRemarks() != null) task.setRemarks(taskDTO.getRemarks());
        if (taskDTO.getDeadline() != null) task.setDeadline(taskDTO.getDeadline());

        if (taskDTO.getAssigneeId() != null) {
            Employee assignee = employeeRepository.findById(taskDTO.getAssigneeId()).orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
            task.setAssignee(assignee);
        }

        Task savedTask = taskRepository.save(task);

        if (savedTask.getProject() != null) {
            recalculateProjectStatus(savedTask.getProject());
        }

        return mapToDTO(savedTask);
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        Project project = task.getProject();
        taskRepository.delete(task);
        if (project != null) {
            recalculateProjectStatus(project);
        }
    }

    private void recalculateProjectStatus(Project project) {
        List<Task> projectTasks = taskRepository.findAll().stream()
                .filter(t -> t.getProject() != null && t.getProject().getId().equals(project.getId()))
                .collect(Collectors.toList());

        if (projectTasks.isEmpty()) return;

        boolean allCompleted = projectTasks.stream().allMatch(t -> t.getStatus() == ProjectStatus.COMPLETED);
        boolean anyStarted = projectTasks.stream().anyMatch(t -> t.getStatus() == ProjectStatus.IN_PROGRESS || t.getStatus() == ProjectStatus.COMPLETED);

        if (allCompleted) {
            project.setStatus(ProjectStatus.COMPLETED);
        } else if (anyStarted) {
            project.setStatus(ProjectStatus.IN_PROGRESS);
        } else {
            project.setStatus(ProjectStatus.PENDING);
        }
        projectRepository.save(project);
    }

    private TaskDTO mapToDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        if(task.getStatus() != null) dto.setStatus(task.getStatus().name());
        dto.setProgress(task.getProgress());
        dto.setRemarks(task.getRemarks());
        dto.setDeadline(task.getDeadline());
        
        if (task.getProject() != null) {
            dto.setProjectId(task.getProject().getId());
        }
        
        if (task.getAssignee() != null) {
            dto.setAssigneeId(task.getAssignee().getId());
            EmployeeDTO empDto = new EmployeeDTO();
            empDto.setId(task.getAssignee().getId());
            empDto.setFirstname(task.getAssignee().getFirstname());
            empDto.setLastname(task.getAssignee().getLastname());
            empDto.setEmail(task.getAssignee().getEmail());
            empDto.setDepartment(task.getAssignee().getDepartment());
            dto.setAssignee(empDto);
        }
        
        return dto;
    }
}
