package com.spring.employee.repository;

import com.spring.employee.model.Task;
import com.spring.employee.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.spring.employee.model.ProjectStatus;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t WHERE " +
           "(:query IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:assigneeId IS NULL OR t.assignee.id = :assigneeId)")
    Page<Task> searchTasks(@Param("query") String query, @Param("status") ProjectStatus status, @Param("assigneeId") Long assigneeId, Pageable pageable);

    List<Task> findByAssignee(Employee assignee);
    
    List<Task> findByStatus(ProjectStatus status);
}
