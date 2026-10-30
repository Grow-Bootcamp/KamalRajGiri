# Week 5 Day 2 – Relationships, SQL JOINs & MySQL Datatypes

# Relationship in MySQL

A relationship describes how records in one table are connected to records in another table.

## 1. One-to-One Relationship

One record in Table A is associated with only one record in Table B, and vice versa.

```text
Student 1 ───── 1 StudentProfile
```

Example:

One student has one student profile, and one profile belongs to one student.

---

## 2. One-to-Many Relationship

One record in Table A can have many records in Table B, while each record in Table B is associated with one record in Table A.

```text
Department 1 ─────── N Students
```

Example:

One department can have many students, but each student belongs to one department.

---

## 3. Many-to-Many Relationship

Many records in Table A can be related to many records in Table B.

```text
Students N ───────── N Courses
```

Example:

* One student can take many courses.
* One course can have many students.

A many-to-many relationship is normally implemented using a **junction table**.

```text
Students 1 ───── N Student_Courses N ───── 1 Courses
```

The junction table stores the foreign keys of both related tables.

Example:

```text
student_courses

student_id | course_id
-----------+----------
1          | 1
1          | 2
1          | 3
2          | 1
2          | 2
3          | 1
```

This converts the many-to-many relationship into two one-to-many relationships.

---

# Primary Key in a Junction Table

A junction table can use a **composite primary key** made from both foreign keys.

```sql
PRIMARY KEY (student_id, course_id)
```

This means the combination of `student_id` and `course_id` must be unique.

For example:

```text
1 | 1
```

can exist only once.

Without the composite primary key, the same relationship could accidentally be inserted multiple times:

```text
1 | 1
1 | 1
1 | 1
```

This would create duplicate relationships and could produce incorrect results when using `COUNT()` and other queries.

---

# SQL JOINs

The main idea behind a JOIN is:

> Combine rows from two or more tables based on a related column.

For example:

```text
students
    |
    | student_id
    ↓
student_courses
    |
    | course_id
    ↓
courses
```

---

## 1. INNER JOIN

`INNER JOIN` returns only rows where a matching relationship exists.

For example:

**Show each student's name and the course they are enrolled in.**

```sql
SELECT s.name AS student_name,
       c.name AS course_name
FROM students AS s
INNER JOIN student_courses AS sc
    ON s.id = sc.student_id
INNER JOIN courses AS c
    ON sc.course_id = c.id;
```

If a student has no course relationship, that student will not appear in the result.

```text
INNER JOIN
= only matching records
```

---

## 2. LEFT JOIN

`LEFT JOIN` returns all rows from the left table and matching rows from the right table if available.

If no matching row exists, the right-side columns contain `NULL`.

For example:

**Show all students, along with their courses if they have any.**

```sql
SELECT s.name AS student_name,
       c.name AS course_name
FROM students AS s
LEFT JOIN student_courses AS sc
    ON s.id = sc.student_id
LEFT JOIN courses AS c
    ON sc.course_id = c.id;
```

If a student has no course:

```text
Bikash | NULL
```

The student is still included because LEFT JOIN preserves all rows from the left table.

```text
LEFT JOIN
= keep everything from the left table
```

---

## 3. RIGHT JOIN

`RIGHT JOIN` returns all rows from the right table and matching rows from the left table if available.

```sql
SELECT s.name AS student_name,
       c.name AS course_name
FROM students AS s
RIGHT JOIN student_courses AS sc
    ON s.id = sc.student_id
RIGHT JOIN courses AS c
    ON sc.course_id = c.id;
```

```text
RIGHT JOIN
= keep everything from the right table
```

A RIGHT JOIN can often be rewritten as a LEFT JOIN by changing the order of the tables.

---

## 4. FULL OUTER JOIN

A FULL OUTER JOIN keeps all rows from both tables, whether or not they have a match.

Conceptually:

```text
Table A
   +
Table B
   ↓
All matching + unmatched rows from both tables
```

MySQL does **not** provide a native `FULL OUTER JOIN`.

It can be simulated using `LEFT JOIN`, `RIGHT JOIN`, and `UNION`.

---

# ON vs WHERE in JOINs

`ON` and `WHERE` have different purposes.

## ON

`ON` defines how records should match during the JOIN.

```sql
ON s.id = sc.student_id
```

It controls the relationship between the tables.

## WHERE

`WHERE` filters the final result.

```sql
WHERE c.name = 'Database'
```

For example:

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

If the condition is placed in the `ON` clause:

```sql
LEFT JOIN courses AS c
    ON sc.course_id = c.id
    AND c.name = 'Database';
```

the LEFT JOIN can still preserve students whose course does not match, showing `NULL` for the course.

### Important rule

```text
ON
→ controls matching

WHERE
→ filters the final result
```

---

# Useful JOIN Patterns

## Find students with no course

```sql
SELECT s.name AS student_name
FROM students AS s
LEFT JOIN student_courses AS sc
    ON s.id = sc.student_id
WHERE sc.student_id IS NULL;
```

Pattern:

```text
LEFT JOIN + IS NULL
= find records with no relationship
```

---

## Find courses with no students

```sql
SELECT c.name AS course_name
FROM courses AS c
LEFT JOIN student_courses AS sc
    ON c.id = sc.course_id
WHERE sc.course_id IS NULL;
```

---

# GROUP BY and JOINs

JOINs can be combined with aggregate functions such as `COUNT()`.

## Count students per course

```sql
SELECT c.name AS course_name,
       COUNT(sc.student_id) AS student_count
FROM courses AS c
LEFT JOIN student_courses AS sc
    ON c.id = sc.course_id
GROUP BY c.id, c.name;
```

Example result:

```text
Database           3
Web Development    2
Operating Systems  1
Computer Networks 0
```

`COUNT(sc.student_id)` does not count `NULL`.

Therefore, a course with no students can correctly show:

```text
0
```

---

# HAVING

`HAVING` is used to filter grouped results.

For example:

**Find students taking more than one course.**

```sql
SELECT s.name AS student_name,
       COUNT(sc.course_id) AS course_count
FROM students AS s
INNER JOIN student_courses AS sc
    ON s.id = sc.student_id
GROUP BY s.id, s.name
HAVING COUNT(sc.course_id) > 1;
```

Result:

```text
Kamal   3
Aagyat  2
```

### WHERE vs HAVING

```text
WHERE
→ filters rows before grouping

HAVING
→ filters groups after GROUP BY
```

---

# DISTINCT

`DISTINCT` removes duplicate values from the query result.

Example:

```sql
SELECT DISTINCT name
FROM courses;
```

If the table contains:

```text
Database
Web Development
Computer Networks
Computer Networks
```

the result becomes:

```text
Database
Web Development
Computer Networks
```

Important:

> `DISTINCT` does not delete duplicate records from the table. It only removes duplicate values from the result.

---

# Main MySQL Datatype Categories

```text
MySQL Datatypes
│
├── Numeric
│   ├── INT
│   ├── BIGINT
│   ├── DECIMAL
│   ├── FLOAT
│   └── DOUBLE
│
├── String
│   ├── CHAR
│   ├── VARCHAR
│   └── TEXT
│
├── Date & Time
│   ├── DATE
│   ├── TIME
│   ├── DATETIME
│   └── TIMESTAMP
│
└── Other
    └── BOOLEAN
```

---

# 1. INT

Used for whole numbers.

```sql
age INT
```

Example:

```text
18
22
35
```

---

# 2. BIGINT

Used when numbers can become much larger than a normal `INT`.

```sql
population BIGINT
```

Use it when the expected range may exceed the capacity of a normal integer.

---

# 3. DECIMAL

Used when exact decimal precision matters.

For financial values, `DECIMAL` is generally preferred over floating-point types.

```sql
price DECIMAL(10,2)
```

`DECIMAL(10,2)` means:

* `10` → total number of digits
* `2` → digits after the decimal point

Example:

```text
45000.75
```

DECIMAL is suitable for:

* Price
* Salary
* Tax
* Account balance
* Financial calculations

---

# 4. FLOAT / DOUBLE

These are floating-point numeric types.

They are useful when approximate values are acceptable, such as:

* Scientific measurements
* Sensor readings
* Temperature
* Certain statistical calculations

Example:

```sql
temperature DOUBLE
```

For exact monetary calculations, `DECIMAL` is generally preferred.

---

# 5. VARCHAR

Used for variable-length text.

```sql
name VARCHAR(100)
```

Example:

```text
Kamal
Aagyat
Anjana
```

`VARCHAR(100)` allows text up to the specified length.

---

# 6. CHAR

`CHAR` is fixed-length text.

```sql
country_code CHAR(2)
```

Example:

```text
NP
IN
US
```

It is useful when the value normally has a fixed length.

---

# 7. TEXT

Used for larger amounts of text.

```sql
description TEXT
```

Example:

```text
description of a product,
article content,
long comments
```

---

# 8. DATE

Stores a calendar date.

Format:

```text
YYYY-MM-DD
```

Example:

```sql
birth_date DATE
```

Value:

```text
2004-05-14
```

---

# 9. TIME

Stores a time value.

Example:

```sql
login_time TIME
```

Value:

```text
14:30:00
```

---

# 10. DATETIME

Stores both date and time.

Useful for:

* `created_at`
* `updated_at`
* `event_time`

Example:

```sql
created_at DATETIME
```

Value:

```text
2026-10-05 14:30:00
```

---

# 11. TIMESTAMP

Also stores date and time, but has different characteristics and behaviors from `DATETIME`.

It is commonly used for automatic timestamp fields.

Example:

```sql
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

This can automatically store the current timestamp when a record is created.

---

# 12. BOOLEAN

MySQL supports:

```sql
BOOLEAN
```

It is commonly used for true/false values.

Example:

```sql
is_active BOOLEAN
```

Typical values:

```text
TRUE  → 1
FALSE → 0
```

---

# Choosing the Appropriate Datatype

| Data          | Recommended Type         | Reason                          |
| ------------- | ------------------------ | ------------------------------- |
| Age           | `INT`                    | Whole number                    |
| Population    | `BIGINT`                 | Potentially very large number   |
| Price         | `DECIMAL`                | Exact precision                 |
| Temperature   | `DOUBLE`                 | Approximate measurement         |
| Name          | `VARCHAR`                | Variable-length text            |
| Country code  | `CHAR(2)`                | Fixed-length value              |
| Description   | `TEXT`                   | Large text                      |
| Birth date    | `DATE`                   | Date only                       |
| Login time    | `TIME`                   | Time only                       |
| Created time  | `DATETIME` / `TIMESTAMP` | Date and time                   |
| Active status | `BOOLEAN`                | True/false                      |
| Phone number  | `VARCHAR`                | Identifier rather than quantity |

### Why Phone Number Uses VARCHAR

A phone number should generally be stored as `VARCHAR`, not `INT`.

Example:

```text
+9779812345678
```

A phone number may contain:

* Country code
* `+` symbol
* Leading zeros
* Spaces or formatting

It is also an **identifier**, not a number that we normally perform mathematical calculations on.

---

# Quick Revision

```text
Relationship
→ Defines how tables are connected

Junction Table
→ Implements many-to-many relationships

Composite Primary Key
→ Prevents duplicate combinations

INNER JOIN
→ Only matching rows

LEFT JOIN
→ All left rows + matching right rows

RIGHT JOIN
→ All right rows + matching left rows

FULL OUTER JOIN
→ All rows from both sides
→ Not directly supported by MySQL

ON
→ Controls JOIN matching

WHERE
→ Filters final results

GROUP BY
→ Groups rows for aggregation

HAVING
→ Filters grouped results

DISTINCT
→ Removes duplicate values from result

DECIMAL
→ Exact decimal values

FLOAT / DOUBLE
→ Approximate decimal values

VARCHAR
→ Variable-length text / identifiers

CHAR
→ Fixed-length text

DATE
→ Date only

TIME
→ Time only

DATETIME / TIMESTAMP
→ Date + time

BOOLEAN
→ True / False
```
