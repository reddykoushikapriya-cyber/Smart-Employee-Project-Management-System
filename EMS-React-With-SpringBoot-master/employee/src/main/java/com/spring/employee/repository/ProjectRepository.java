package com.spring.employee.repository;

import com.spring.employee.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.spring.employee.model.ProjectStatus;
import com.spring.employee.model.Priority;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p WHERE " +
           "(:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:status IS NULL OR p.status = :status) " +
           "AND (:priority IS NULL OR p.priority = :priority)")
    Page<Project> searchProjects(@Param("query") String query, @Param("status") ProjectStatus status, @Param("priority") Priority priority, Pageable pageable);
}
