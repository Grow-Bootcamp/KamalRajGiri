CREATE DATABASE relationships_demo;

USE relationships_demo;

-- Student Table
CREATE TABLE students(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(25) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE
);

-- Course Table
CREATE TABLE courses(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Student Courses Table
CREATE TABLE student_courses(
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    -- Composite primary key 
    PRIMARY KEY(student_id, course_id),
    FOREIGN KEY(student_id) REFERENCES students(id),
    FOREIGN KEY(course_id) REFERENCES courses(id)
);

-- Insert sample data
-- Inserting students
INSERT INTO students(name, email) VALUES ('kamal', "kamal@example.com"), ('aagyat', "aagyat@example.com"), ('anjana', 'anjana@example.com');

-- Inserting courses
INSERT INTO courses(name) VALUES ('Database'), ('Web Development'), ('Operating Systems');

-- Inserting student_courses
INSERT INTO student_courses (student_id, course_id)
VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(3, 1);


-- Queries

-- Get all unique course names
SELECT DISTINCT name
FROM courses;

-- SELECT
--     students.name AS student_name,
--     courses.name AS course_name
-- FROM students
-- INNER JOIN student_courses
--     ON students.id = student_courses.student_id
-- INNER JOIN courses
--     ON student_courses.course_id = courses.id;

-- selecting student names and their corresponding course names using different types of joins

-- INNER JOIN
SELECT
    s.name AS student_name,
    c.name AS course_name
FROM students AS s
INNER JOIN student_courses AS sc
    ON s.id = sc.student_id
INNER JOIN courses AS c
    ON sc.course_id = c.id;

-- LEFT JOIN
SELECT
    s.name AS student_name,
    c.name AS course_name
FROM students AS s
LEFT JOIN student_courses AS sc
    ON s.id = sc.student_id
LEFT JOIN courses AS c
    ON sc.course_id = c.id;

-- RIGHT JOIN
SELECT
    s.name AS student_name,
    c.name AS course_name
FROM students AS s
RIGHT JOIN student_courses AS sc
    ON s.id = sc.student_id
RIGHT JOIN courses AS c
    ON sc.course_id = c.id;

-- FULL OUTER JOIN
SELECT *
FROM students AS s
LEFT JOIN student_courses AS sc
    ON s.id = sc.student_id

UNION

SELECT *
FROM students AS s
RIGHT JOIN student_courses AS sc
    ON s.id = sc.student_id;

-- Left Join with Where Clause
SELECT
    s.name AS student_name,
    c.name AS course_name
FROM students AS s
LEFT JOIN student_courses AS sc
    ON s.id = sc.student_id
LEFT JOIN courses AS c
    ON sc.course_id = c.id
WHERE c.name = 'Database';

-- Finding students who are not enrolled in any courses
SELECT
    s.name AS student_name
FROM students AS s
LEFT JOIN student_courses AS sc
    ON s.id = sc.student_id
WHERE sc.student_id IS NULL;

-- Inserting a new course into the courses table
INSERT INTO courses (name)
VALUES ('Computer Networks');

-- Finding courses that have no students enrolled
SELECT
    c.name AS course_name
FROM courses AS c
LEFT JOIN student_courses AS sc
    ON c.id = sc.course_id
WHERE sc.course_id IS NULL;


-- Counting the number of students enrolled in each course
SELECT
    c.name AS course_name,
    COUNT(sc.student_id) AS student_count
FROM courses AS c
LEFT JOIN student_courses AS sc
    ON c.id = sc.course_id
GROUP BY c.id, c.name;

-- Finding students who are enrolled in more than one course
SELECT
    s.name AS student_name,
    COUNT(sc.course_id) AS course_count
FROM students AS s
INNER JOIN student_courses AS sc
    ON s.id = sc.student_id
GROUP BY s.id, s.name
HAVING COUNT(sc.course_id) > 1;



-- Create a table to demonstrate different data types
CREATE TABLE datatype_demo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    country_code CHAR(2),
    age INT,
    salary DECIMAL(10,2),
    temperature DOUBLE,
    birth_date DATE,
    login_time TIME,
    created_at DATETIME,
    is_active BOOLEAN,
    description TEXT
);

DESCRIBE datatype_demo;

INSERT INTO datatype_demo (
    name,
    country_code,
    age,
    salary,
    temperature,
    birth_date,
    login_time,
    created_at,
    is_active,
    description
)
VALUES (
    'Kamal',
    'NP',
    22,
    45000.75,
    28.65,
    '2004-05-14',
    '14:30:00',
    '2026-10-05 14:30:00',
    TRUE,
    'Computer Engineering student'
);

SELECT * FROM datatype_demo;