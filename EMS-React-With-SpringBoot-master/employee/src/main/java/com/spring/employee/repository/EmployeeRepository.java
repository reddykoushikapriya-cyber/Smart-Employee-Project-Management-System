package com.spring.employee.repository;

import com.spring.employee.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    @Query("SELECT e FROM Employee e WHERE " +
           "(:query IS NULL OR LOWER(e.firstname) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.lastname) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:department IS NULL OR e.department = :department)")
    Page<Employee> searchEmployees(@Param("query") String query, @Param("department") String department, Pageable pageable);

}
