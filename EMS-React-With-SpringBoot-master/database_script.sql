-- Create Database
CREATE DATABASE IF NOT EXISTS ems;
USE ems;

-- users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- employees table
CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255),
    department VARCHAR(255)
);

-- projects table
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    status VARCHAR(50),
    priority VARCHAR(50),
    deadline DATE
);

-- project_employees mapping table
CREATE TABLE IF NOT EXISTS project_employees (
    project_id BIGINT,
    employee_id BIGINT,
    PRIMARY KEY (project_id, employee_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    progress INT DEFAULT 0,
    status VARCHAR(50),
    remarks TEXT,
    deadline DATE,
    project_id BIGINT,
    assignee_id BIGINT,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assignee_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- Insert Default Admin (Password is 'admin123' hashed with BCrypt)
INSERT IGNORE INTO users (email, password, role) VALUES ('admin@example.com', '$2a$10$wY9Cj.Wf9w8wQ.tOQkZ3..rV4Z9wZ.yZ3.Wf9w8wQ.tOQkZ3..rV4', 'ADMIN');
