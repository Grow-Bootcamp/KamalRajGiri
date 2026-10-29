CREATE DATABASE day4_indexing;
USE day4_indexing;

CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    department VARCHAR(100),
    salary DECIMAL(10,2)
);

INSERT INTO employees (name, email, department, salary)
VALUES
('Kamal', 'kamal@example.com', 'IT', 50000),
('Aagyat', 'aagyat@example.com', 'HR', 45000),
('Anjana', 'anjana@example.com', 'IT', 55000),
('Suman', 'suman@example.com', 'Finance', 60000),
('Bikash', 'bikash@example.com', 'IT', 52000);