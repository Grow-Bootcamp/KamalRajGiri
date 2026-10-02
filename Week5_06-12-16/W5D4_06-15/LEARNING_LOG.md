# Week 5 Day 1 — MySQL Introduction & Relational Data Modeling

## Date
October 1, 2026

## Objective

The objective of Day 1 was to understand MySQL as a relational database system, review SQL vs NoSQL, learn relational data modeling and normalization, and implement a normalized schema using appropriate database constraints.

# 1. SQL vs NoSQL

| Feature         | SQL                        | NoSQL                                         |
| --------------- | -------------------------- | --------------------------------------------- |
| Main structure  | Tables                     | Documents / key-value / graphs / other models |
| Schema          | Usually predefined         | Often flexible                                |
| Relationships   | Strong relational support  | Depends on the database                       |
| Joins           | Native support             | Usually handled differently                   |
| Transactions    | Strong support             | Depends on the database                       |
| Best suited for | Structured relational data | Flexible or highly variable data              |
| Examples        | MySQL, PostgreSQL          | MongoDB, Redis                                |

## When should we use SQL?
SQL is particularly useful when:
* Data has clear relationships.
* Data consistency is important.
* Transactions are important.
* The schema is relatively stable.
* Complex queries and joins are required.
* Constraints must be enforced by the database.

NoSQL can be useful when:
* Data structures are highly variable or frequently changing.
* Flexible schema design is useful.
* Data naturally fits a document, key-value, graph, or other NoSQL model.
* The application's workload benefits from the characteristics of a particular NoSQL database.

The choice between SQL and NoSQL depends on the application's data model, consistency requirements, query patterns, scalability requirements, and the capabilities of the selected database.

---

# 2. What is MySQL?

MySQL is a relational database management system (RDBMS).
It uses SQL (Structured Query Language) to create, read, update, and delete data.
The four common CRUD operations are:

```
Create
Read
Update
Delete
```
MySQL stores relational data primarily using tables consisting of rows and columns.

---

# 3. MySQL Setup

The installed MySQL environment was verified using:

```bash
mysql --version
```

Installed MySQL Server version:
```text
MySQL 8.0.42
```

MySQL Shell was also available:
```bash
mysqlsh --version
```

The MySQL server was successfully accessed through the MySQL command-line client.

The active database was verified using:
```sql
SELECT DATABASE();
```
A dedicated practice database was created:
```sql
CREATE DATABASE mysql_day1;
USE mysql_day1;
```
---

# 4. MySQL Basic Structure

The basic hierarchy studied was:

```text
MySQL Server
    |
    +-- Database
          |
          +-- Tables
                |
                +-- Rows
                |
                +-- Columns
```

Important commands practiced:

```sql
SHOW DATABASES;
CREATE DATABASE mysql_day1;
USE mysql_day1;
SHOW TABLES;
DESC table_name;
SHOW CREATE TABLE table_name;
```

`SHOW CREATE TABLE` was particularly useful for verifying the actual constraints defined on a table.

---

# 5. Relational Data Modeling
Relational data modeling is the process of identifying entities, their attributes, and the relationships between them, and then representing them using related tables.

For the Day 1 practice database, the main entities were:

```text
Department
Course
Student
Enrollment
```

Each entity was given its own table.
The relationships were:

```text
Department 1 ────────< Course

Student 1 ───────────< Enrollment >────────── 1 Course
```

Therefore:

```text
Student M:N Course
```
The many-to-many relationship is implemented using the `enrollments` relationship/junction table.

---

# 6. Problems with Poor Table Design
An initial `student_data` table was used to understand problems with storing different types of information together.

Example structure:

```text
student_data
------------------------------------------------
student_id
student_name
email
course
department
```

This table mixes information about:

* Students
* Courses
* Departments

For example:

```text
student_id | student_name | course
1          | Kamal        | Computer Engineering, BCE
```

If the two course values represent separate courses, storing them in one column violates the idea of atomic values.

The design can also cause redundancy and several types of anomalies.

---

## 6.1 Data Redundancy

Data redundancy occurs when the same fact is stored unnecessarily in multiple places.

For example:

```text
student_id | student_name | course               | department
1          | Kamal        | Database Systems     | Engineering
2          | Sita         | Web Technology       | Engineering
3          | Ram          | Computer Networks   | Engineering
```

The department value `Engineering` is repeated.

Redundancy itself is not always immediately disastrous. The bigger problem is what the redundancy can cause.

---

## 6.2 Update Anomaly

An update anomaly occurs when the same fact is stored in multiple rows and changing that fact requires updating multiple records.

For example, suppose a department name is stored repeatedly:

```text
Engineering
Engineering
Engineering
```

If the department name changes, every affected row must be updated.

If one row is updated but another is not, the database can contain conflicting information.

Normalization reduces this problem by storing the department information once in a `departments` table and referencing it using `department_id`.

---

## 6.3 Insert Anomaly

An insert anomaly occurs when the database design makes it difficult or impossible to insert a fact without also inserting unrelated information.

For example, if course and department information are stored only inside a student table, we may not be able to store a new department or course until a student is also available.

After normalization, a department can be inserted independently:

```sql
INSERT INTO departments (department_name)
VALUES ('Science');
```

A course can then reference that department.

---

## 6.4 Delete Anomaly

A delete anomaly occurs when deleting one record unintentionally removes the only stored information about another fact.

For example, if a department exists only because one student belongs to it, deleting that student's row could also remove the only stored information about the department.

Separating entities into their own tables prevents unrelated facts from depending on the existence of a particular row.

---

# 7. Normalization

Normalization is the process of organizing relational data to reduce unnecessary redundancy and dependency problems while maintaining appropriate relationships between entities.

The main normal forms studied were:

```text
1NF → Atomic values
2NF → Remove partial dependencies
3NF → Remove transitive dependencies
```

Normalization should not be understood as simply "creating more tables."

The goal is to place each fact in the table representing the entity or relationship that the fact describes.

---

# 8. First Normal Form — 1NF

A table satisfies 1NF when values are atomic and there are no repeating groups or multi-valued fields inside a single column.

Problematic example:

```text
student_id | student_name | phone_numbers
1          | Kamal        | 9841..., 9802...
```

The `phone_numbers` cell contains multiple values.

Instead:

```text
student_id | phone_number
1          | 9841...
1          | 9802...
```

Each cell now contains one value.

Another example from the initial practice table was:

```text
course = "Computer Engineering, BCE"
```

If these represent separate courses, they should not be stored as multiple values inside one column.

The relationship should instead be represented using separate rows in an appropriate relationship table.

### Important

**1NF does NOT mean that the database is fully normalized.**

It only establishes the first level of structure.

Redundancy and entity-mixing problems can still exist after achieving 1NF.

---

# 9. Second Normal Form — 2NF

A table must already be in 1NF.

Then every non-key attribute must depend on the **whole primary key**.

This concept becomes important when a table has a composite primary key.

Example:

```text
order_items
------------------------------------------------
order_id | product_id | product_name | quantity

1001     | 10         | Keyboard     | 2
1001     | 20         | Mouse        | 1
1002     | 10         | Keyboard     | 3
```

Suppose the primary key is:

```text
(order_id, product_id)
```

The dependency is:

```text
product_id → product_name
```

`product_name` depends only on `product_id`, not on the complete key:

```text
(order_id, product_id)
```

This is a **partial dependency**.

To remove it:

```text
order_items
-----------------------------
order_id
product_id
quantity
```

and:

```text
products
-----------------------------
product_id
product_name
```

Now product information is stored in the table representing the product.

### Important observation

If a table has a single-column primary key, there cannot be a partial dependency on part of that key because there is no smaller part of the key.

---

# 10. Third Normal Form — 3NF

A table must satisfy 2NF.

Then non-key attributes should not depend on other non-key attributes.

Example:

```text
employees
--------------------------------
employee_id
employee_name
department_id
department_name
```

The dependencies are:

```text
employee_id → department_id

department_id → department_name
```

Therefore:

```text
employee_id → department_id → department_name
```

`department_name` does not really describe the employee.

It describes the department.

This creates a **transitive dependency**.

The design can be separated into:

```text
departments
----------------
department_id
department_name
```

and:

```text
employees
----------------
employee_id
employee_name
department_id
```

Now the department name is stored once in the `departments` table.

---

# 11. Final Normalized Schema

The final practice database contains:

```text
departments
courses
students
enrollments
```

The design separates different entities and represents their relationships using foreign keys.

```text
Department 1 ────────< Course

Student 1 ───────────< Enrollment >────────── 1 Course
```

Therefore:

```text
Student M:N Course
```

is represented through the `enrollments` relationship table.

---

# 12. Departments Table

```sql
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE
);
```

Constraints:

* `department_id` → Primary Key
* `AUTO_INCREMENT` → Automatically generates identifiers
* `department_name` → `NOT NULL`
* `department_name` → `UNIQUE`

Sample data:

```text
1 | Engineering
2 | Management
3 | Science
```

---

# 13. Courses Table

```sql
CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,

    FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
);
```

The `department_id` creates a relationship between courses and departments.

A course cannot reference a department that does not exist.

---

# 14. Students Table

```sql
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE
);
```

The email is:

```text
NOT NULL
UNIQUE
```

This means every student must have an email and two students cannot use the same email.

---

# 15. Enrollments Table

```sql
CREATE TABLE enrollments (
    student_id INT NOT NULL,
    course_id INT NOT NULL,

    PRIMARY KEY (student_id, course_id),

    FOREIGN KEY (student_id)
        REFERENCES students(student_id),

    FOREIGN KEY (course_id)
        REFERENCES courses(course_id)
);
```

This table represents the many-to-many relationship between students and courses.

The combination:

```text
(student_id, course_id)
```

is the primary key.

Therefore, the same student cannot be enrolled in the same course more than once.

However:

```text
(1, 2)
(1, 3)
(1, 4)
```

is valid because the combinations are different.

---

# 16. Constraints Practiced

## PRIMARY KEY

A primary key uniquely identifies a row.

Example:

```sql
student_id INT PRIMARY KEY
```

A primary key cannot contain duplicate values and cannot be `NULL`.

A table has one primary key definition, although that primary key can contain multiple columns.

---

## AUTO_INCREMENT

Automatically generates numeric identifiers for new rows.

An important observation was that auto-increment values do not have to be gapless.

The course IDs started from `2` rather than `1` because an earlier failed insert had consumed an auto-increment value.

Therefore, auto-increment values should be treated as identifiers, not as guaranteed sequential numbers without gaps.

---

## UNIQUE

Prevents duplicate values.

Test performed:

```sql
INSERT INTO students
(student_name, email)
VALUES
('Test Student', 'kamal@example.com');
```

Result:

```text
ERROR 1062
Duplicate entry 'kamal@example.com'
```

This demonstrated that the `UNIQUE` constraint was enforced.

---

## NOT NULL

Prevents a column from containing `NULL`.

Test performed:

```sql
INSERT INTO students
(student_name, email)
VALUES
(NULL, 'nulltest@example.com');
```

Result:

```text
ERROR 1048
Column 'student_name' cannot be null
```

Another test:

```sql
INSERT INTO students
(student_name, email)
VALUES
('Null Email Test', NULL);
```

Result:

```text
ERROR 1048
Column 'email' cannot be null
```

---

## FOREIGN KEY

Maintains referential integrity between related tables.

Test:

```sql
INSERT INTO enrollments
(student_id, course_id)
VALUES
(1, 999);
```

Result:

```text
ERROR 1452
Cannot add or update a child row
```

The database rejected the enrollment because course `999` does not exist.

---

# 17. Composite Primary Key Experiment

The following relationship already existed:

```text
student_id | course_id
-----------+----------
1          | 2
```

Trying to insert it again:

```sql
INSERT INTO enrollments
(student_id, course_id)
VALUES
(1, 2);
```

produced:

```text
ERROR 1062
Duplicate entry '1-2'
```

However:

```sql
INSERT INTO enrollments
(student_id, course_id)
VALUES
(1, 4);
```

succeeded.

This demonstrated that uniqueness applies to the combination of both columns rather than to each column independently.

---

# 18. Referential Integrity Experiment

The following operation was attempted:

```sql
DELETE FROM courses
WHERE course_id = 2;
```

It was rejected because existing enrollment records reference course `2`.

Similarly:

```sql
DELETE FROM students
WHERE student_id = 1;
```

was rejected because enrollment records reference student `1`.

This demonstrated that foreign keys protect related data from becoming orphaned.

---

# 19. ON DELETE Behavior

Three important referential actions were studied.

### RESTRICT

Prevents deletion of a referenced parent record.

```sql
ON DELETE RESTRICT
```

### CASCADE

Deletes related child records when the parent is deleted.

```sql
ON DELETE CASCADE
```

### SET NULL

Sets the child foreign-key value to `NULL` when the parent is deleted.

```sql
ON DELETE SET NULL
```

`SET NULL` requires the foreign-key column to allow `NULL`.

The Day 1 schema intentionally kept the default foreign-key behavior so referential-integrity protection could be demonstrated directly.

---

# 20. Final Verified Data

## Departments

```text
1 | Engineering
2 | Management
3 | Science
```

## Courses

```text
2 | CT401 | Database Management Systems | 1
3 | CT402 | Web Technology              | 1
4 | CT403 | Computer Networks            | 1
5 | MG401 | Principles of Management     | 2
6 | SC401 | Applied Science              | 3
```

## Students

```text
1 | Kamal Raj Giri | kamal@example.com
2 | Sita Sharma    | sita@example.com
3 | Ram Thapa      | ram@example.com
4 | Hari Bista     | hari@example.com
5 | Aagyat         | aagyat@example.com
```

## Enrollments

```text
1 | 2
1 | 3
1 | 4
2 | 2
2 | 4
3 | 2
4 | 5
5 | 2
5 | 3
```

---

# 21. Key Takeaways

1. SQL databases organize structured data into related tables.
2. NoSQL databases use different models such as documents, key-value structures, and graphs.
3. SQL is useful when relationships, consistency, transactions, constraints, and complex relational queries are important.
4. MySQL is an RDBMS that uses SQL.
5. Relational modeling separates entities and represents their relationships.
6. Data redundancy can lead to update, insert, and delete anomalies.
7. Normalization reduces unnecessary redundancy and dependency problems.
8. 1NF focuses on atomic values and eliminating repeating groups.
9. 2NF removes partial dependencies involving composite keys.
10. 3NF removes transitive dependencies.
11. Primary keys uniquely identify records.
12. `AUTO_INCREMENT` generates identifiers but does not guarantee gapless numbering.
13. `UNIQUE` prevents duplicate values.
14. `NOT NULL` prevents required columns from containing `NULL`.
15. Foreign keys maintain referential integrity.
16. Composite primary keys are useful for relationship tables.
17. Many-to-many relationships can be represented using a junction/relationship table.
18. Foreign keys can prevent invalid references and unsafe parent deletion.
19. `SHOW CREATE TABLE` is useful for verifying the actual schema and constraints.
20. Normalization is about placing each fact in the table representing the entity or relationship that the fact describes.

---

# 22. Day 1 Acceptance Criteria Status

* [x] MySQL installed and successfully connected.
* [x] Created and used `mysql_day1`.
* [x] Reviewed SQL vs NoSQL.
* [x] Studied relational data modeling.
* [x] Applied 1NF, 2NF, and 3NF concepts.
* [x] Designed a normalized relational schema.
* [x] Created tables with appropriate constraints.
* [x] Practiced primary keys and composite primary keys.
* [x] Practiced foreign keys and referential integrity.
* [x] Tested UNIQUE and NOT NULL constraints.
* [x] Created a reproducible SQL script.
* [x] Created this learning log.
* [x] Commit changes to Git.
* [x] Push changes to GitHub.
* [x] Raise GitHub Pull Request.
* [x] Post learning-log and PR links in open project.
* [x] Post learning-log and PR links in Microsoft Teams.
