# Week 5 Day 2 – Relationships, Joins & Datatypes in MySQL

**Intern:** Kamal Raj Giri
**Week:** 5
**Day:** 2
**Topic:** Relationships, Joins & Datatypes in MySQL
**Database:** `relationships_demo`

---

## 1. Objectives

* Understand one-to-one, one-to-many, and many-to-many relationships.
* Implement many-to-many relationships using a junction table.
* Understand primary keys, foreign keys, and composite primary keys.
* Practice INNER, LEFT, and RIGHT JOIN.
* Understand `ON` vs `WHERE`.
* Use `GROUP BY`, `COUNT()`, and `HAVING()`.
* Understand common MySQL data types and choose appropriate types for different data.

---

## 2. Relationships

### One-to-One

One record is related to one record in another table.

```text
Person 1 ─── 1 Passport
```

### One-to-Many

One record can be related to multiple records.

```text
Department 1 ─── Many Students
```

### Many-to-Many

Multiple students can take multiple courses, and multiple courses can have multiple students.

This was implemented using a junction table:

```text
students 1 ─── many student_courses many ─── 1 courses
```

The junction table converts the many-to-many relationship into two one-to-many relationships.

---

## 3. Many-to-Many Implementation

Created the following tables:

```sql
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE student_courses (
    student_id INT,
    course_id INT,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

The `student_courses` table stores the relationship between students and courses.

The composite primary key:

```sql
PRIMARY KEY (student_id, course_id)
```

prevents the same student-course combination from being inserted multiple times.

---

## 4. JOIN Operations

### INNER JOIN

Returns only records that have matching relationships.

```sql
SELECT s.name AS student_name,
       c.name AS course_name
FROM students AS s
INNER JOIN student_courses AS sc
    ON s.id = sc.student_id
INNER JOIN courses AS c
    ON sc.course_id = c.id;
```

Students without courses are not included.

### LEFT JOIN

Returns all records from the left table and matching records from the right table.

```sql
SELECT s.name AS student_name,
       c.name AS course_name
FROM students AS s
LEFT JOIN student_courses AS sc
    ON s.id = sc.student_id
LEFT JOIN courses AS c
    ON sc.course_id = c.id;
```

This included Bikash even though he had no course:

```text
Bikash | NULL
```

### RIGHT JOIN

Returns all records from the right table and matching records from the left table.

```sql
SELECT s.name AS student_name,
       c.name AS course_name
FROM students AS s
RIGHT JOIN student_courses AS sc
    ON s.id = sc.student_id
RIGHT JOIN courses AS c
    ON sc.course_id = c.id;
```

MySQL does not provide a native `FULL OUTER JOIN`; it can be simulated using `LEFT JOIN`, `RIGHT JOIN`, and `UNION`.

---

## 5. ON vs WHERE

A key concept was the difference between JOIN conditions and filtering.

### Condition in WHERE

```sql
SELECT s.name AS student_name,
       c.name AS course_name
FROM students AS s
LEFT JOIN student_courses AS sc
    ON s.id = sc.student_id
LEFT JOIN courses AS c
    ON sc.course_id = c.id
WHERE c.name = 'Database';
```

This returns only students taking Database.

### Condition in ON

```sql
SELECT s.name AS student_name,
       c.name AS course_name
FROM students AS s
LEFT JOIN student_courses AS sc
    ON s.id = sc.student_id
LEFT JOIN courses AS c
    ON sc.course_id = c.id
    AND c.name = 'Database';
```

This preserves all students because the LEFT JOIN still keeps the left-side records.

**Key difference:**

```text
ON     → controls which records match during the JOIN
WHERE  → filters the final result
```

---

## 6. Useful Relationship Queries

### Students enrolled in Database

```sql
SELECT s.name AS student_name
FROM students AS s
INNER JOIN student_courses AS sc
    ON s.id = sc.student_id
INNER JOIN courses AS c
    ON sc.course_id = c.id
WHERE c.name = 'Database';
```

### Students with no course

```sql
SELECT s.name AS student_name
FROM students AS s
LEFT JOIN student_courses AS sc
    ON s.id = sc.student_id
WHERE sc.student_id IS NULL;
```

This returned **Bikash**.

### Courses with no students

```sql
SELECT c.name AS course_name
FROM courses AS c
LEFT JOIN student_courses AS sc
    ON c.id = sc.course_id
WHERE sc.course_id IS NULL;
```

### Count students per course

```sql
SELECT c.name AS course_name,
       COUNT(sc.student_id) AS student_count
FROM courses AS c
LEFT JOIN student_courses AS sc
    ON c.id = sc.course_id
GROUP BY c.id, c.name;
```

`COUNT(sc.student_id)` does not count NULL values, allowing courses with no students to show a count of `0`.

### Students taking more than one course

```sql
SELECT s.name AS student_name,
       COUNT(sc.course_id) AS course_count
FROM students AS s
INNER JOIN student_courses AS sc
    ON s.id = sc.student_id
GROUP BY s.id, s.name
HAVING COUNT(sc.course_id) > 1;
```

This returned:

```text
Kamal   3
Aagyat  2
```

---

## 7. DISTINCT and Duplicate Data

Two `Computer Networks` records were inserted into the `courses` table.

Since `name` was not defined as `UNIQUE`, MySQL allowed both records.

To display unique course names:

```sql
SELECT DISTINCT name
FROM courses;
```

`DISTINCT` removes duplicate values from the query result; it does not remove records from the table.

---

## 8. MySQL Datatypes

### Numeric

| Type      | Usage                                           |
| --------- | ----------------------------------------------- |
| `INT`     | Normal whole numbers                            |
| `BIGINT`  | Very large whole numbers                        |
| `DECIMAL` | Exact values such as money                      |
| `FLOAT`   | Approximate decimal values                      |
| `DOUBLE`  | Approximate values with greater range/precision |

Example:

```sql
salary DECIMAL(10,2)
temperature DOUBLE
```

### String

| Type         | Usage                |
| ------------ | -------------------- |
| `CHAR(n)`    | Fixed-length values  |
| `VARCHAR(n)` | Variable-length text |
| `TEXT`       | Larger text          |

### Date and Time

| Type        | Usage                                         |
| ----------- | --------------------------------------------- |
| `DATE`      | Date only                                     |
| `TIME`      | Time only                                     |
| `DATETIME`  | Date and time                                 |
| `TIMESTAMP` | Date/time, commonly used for timestamp fields |

### Boolean

```sql
is_active BOOLEAN
```

MySQL represents BOOLEAN using a numeric representation such as `0` and `1`.

---

## 9. Datatype Selection Examples

| Data         | Recommended Type         | Reason                     |
| ------------ | ------------------------ | -------------------------- |
| Age          | `INT`                    | Whole number               |
| Salary       | `DECIMAL`                | Exact monetary value       |
| Temperature  | `DOUBLE`                 | Measurement                |
| Name         | `VARCHAR`                | Variable-length text       |
| Country code | `CHAR(2)`                | Fixed-length code          |
| Description  | `TEXT`                   | Large text                 |
| Birth date   | `DATE`                   | Date only                  |
| Login time   | `TIME`                   | Time only                  |
| Created time | `DATETIME` / `TIMESTAMP` | Date and time              |
| Phone number | `VARCHAR`                | Identifier, not a quantity |

A phone number should generally be stored as `VARCHAR` because it may contain country codes such as `+977`, leading zeros, or formatting characters.

---

## 10. Key Learnings

* Many-to-many relationships require a junction table.
* Foreign keys establish relationships between tables.
* Composite primary keys can prevent duplicate relationships.
* `INNER JOIN` returns matching records.
* `LEFT JOIN` preserves all records from the left table.
* `RIGHT JOIN` preserves all records from the right table.
* `LEFT JOIN` with `IS NULL` can identify records without relationships.
* `ON` controls JOIN matching, while `WHERE` filters the final result.
* `GROUP BY` is used for grouping and aggregation.
* `HAVING` filters grouped results.
* `COUNT(column)` does not count NULL values.
* `DISTINCT` removes duplicate values from query results.
* Data types should be selected according to the meaning and expected range of the data.
* `DECIMAL` is appropriate for exact financial values, while identifiers such as phone numbers are better stored as `VARCHAR`.

---

## 11. Practical Work Completed

The following were completed during the session:

* Created `relationships_demo` database.
* Created `students`, `courses`, and `student_courses` tables.
* Implemented a many-to-many relationship.
* Used primary keys, foreign keys, and a composite primary key.
* Practiced INNER, LEFT, and RIGHT JOIN.
* Compared `ON` and `WHERE`.
* Queried records with and without relationships.
* Used `GROUP BY`, `COUNT()`, and `HAVING()`.
* Practiced `DISTINCT`.
* Studied and selected appropriate MySQL data types.
* Tested relationship behavior using students with and without course enrollments.

---

## 12. Acceptance Criteria

* [x] Design and query a many-to-many relationship using a junction table.
* [x] Write INNER JOIN queries.
* [x] Write LEFT JOIN queries.
* [x] Write RIGHT JOIN queries.
* [x] Select appropriate MySQL data types.
* [x] Complete the learning log.
* [ ] Commit the learning log to the `GrowBootCamp` repository.
* [ ] Create and share the Pull Request with the mentor.

---

## 13. Conclusion

Week 5 Day 2 strengthened practical understanding of relational database design and SQL querying. The main focus was connecting tables through relationships and retrieving related data using different JOIN operations.

The practical exercises also clarified important SQL concepts such as composite keys, `ON` vs `WHERE`, `GROUP BY`, `HAVING`, `COUNT()`, and `DISTINCT`. Additionally, selecting appropriate MySQL data types based on the purpose of the stored data was practiced.

The session provided a strong foundation for working with relational databases in backend applications.
