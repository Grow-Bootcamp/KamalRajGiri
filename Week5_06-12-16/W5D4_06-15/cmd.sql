-- ============================================================
-- Week 5 Day 1: MySQL Introduction & Relational Data Modeling
-- Database: mysql_day1
-- ============================================================

CREATE DATABASE IF NOT EXISTS mysql_day1;

USE mysql_day1;

-- ============================================================
-- 1. Departments
-- ============================================================

CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE
);

-- ============================================================
-- 2. Courses
-- ============================================================

CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,

    FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
);

-- ============================================================
-- 3. Students
-- ============================================================

CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE
);

-- ============================================================
-- 4. Enrollments
-- Many-to-many relationship between students and courses
-- ============================================================

CREATE TABLE enrollments (
    student_id INT NOT NULL,
    course_id INT NOT NULL,

    PRIMARY KEY (student_id, course_id),

    FOREIGN KEY (student_id)
        REFERENCES students(student_id),

    FOREIGN KEY (course_id)
        REFERENCES courses(course_id)
);

-- ============================================================
-- 5. Sample Departments
-- ============================================================

INSERT INTO departments (department_name)
VALUES
('Engineering'),
('Management'),
('Science');

-- ============================================================
-- 6. Sample Courses
-- ============================================================

INSERT INTO courses
(course_code, course_name, department_id)
VALUES
('CT401', 'Database Management Systems', 1),
('CT402', 'Web Technology', 1),
('CT403', 'Computer Networks', 1),
('MG401', 'Principles of Management', 2),
('SC401', 'Applied Science', 3);

-- ============================================================
-- 7. Sample Students
-- ============================================================

INSERT INTO students
(student_name, email)
VALUES
('Kamal Raj Giri', 'kamal@example.com'),
('Sita Sharma', 'sita@example.com'),
('Ram Thapa', 'ram@example.com'),
('Hari Bista', 'hari@example.com'),
('Aagyat', 'aagyat@example.com');

-- ============================================================
-- 8. Student-Course Enrollments
-- ============================================================

INSERT INTO enrollments
(student_id, course_id)
VALUES
(1, 2),
(1, 3),
(1, 4),
(2, 2),
(2, 4),
(3, 2),
(4, 5),
(5, 2),
(5, 3);

-- ============================================================
-- 9. Verification Queries
-- ============================================================

SHOW TABLES;

SELECT * FROM departments;

SELECT * FROM courses;

SELECT * FROM students;

SELECT *
FROM enrollments
ORDER BY student_id, course_id;

-- ============================================================
-- 10. Constraint Testing Examples
-- ============================================================

-- Duplicate email: UNIQUE constraint
-- INSERT INTO students (student_name, email)
-- VALUES ('Test Student', 'kamal@example.com');

-- NULL student name: NOT NULL constraint
-- INSERT INTO students (student_name, email)
-- VALUES (NULL, 'nulltest@example.com');

-- NULL email: NOT NULL constraint
-- INSERT INTO students (student_name, email)
-- VALUES ('Null Email Test', NULL);

-- Invalid course reference: FOREIGN KEY constraint
-- INSERT INTO enrollments (student_id, course_id)
-- VALUES (1, 999);

-- Duplicate enrollment: composite PRIMARY KEY
-- INSERT INTO enrollments (student_id, course_id)
-- VALUES (1, 2);

-- Delete referenced course: FOREIGN KEY protection
-- DELETE FROM courses
-- WHERE course_id = 2;

-- Delete referenced student: FOREIGN KEY protection
-- DELETE FROM students
-- WHERE student_id = 1;