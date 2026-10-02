# SQL vs NoSQL

| Feature         | SQL                        | NoSQL                               |
| --------------- | -------------------------- | ----------------------------------- |
| Main structure  | Tables                     | Documents / key-value / graphs etc. |
| Schema          | Usually predefined         | Often flexible                      |
| Relationships   | Strong support             | Depends on database                 |
| Joins           | Native                     | Usually handled differently         |
| Transactions    | Strong support             | Depends on database                 |
| Best suited for | Structured relational data | Flexible/highly variable data       |
| Examples        | MySQL, PostgreSQL          | MongoDB, Redis                      |



## When should we use SQL?

SQL is particularly useful when:

data has clear relationships
consistency is important
transactions are important
the schema is relatively stable
complex queries and joins are required
constraints must be enforced by the database

# What is MySQL?

MySQL is a relational database management system (RDBMS).It uses SQL to create, read, update and delete data.

# Problems

1. Redundancy 

Same data may endup storing multiple times.Which is data redundency.But redundancy itself isn't always immediately disastrous.The bigger problem is what redundancy causes.

2.  Update anomaly  
description

3. Insert Anomoly 
Description

4. Delete Anomoly 
Description


# Normalization

## First Normalization Form (1NF)
Each cell should contain one atomic value, and there should be no repeating groups or multi-valued fields inside a single column.

student_id | student_name | phone_numbers
1          | Kamal        | 9841..., 9802...
here we have multiple values in one cell . so we split it 

student_id | phone_number
1          | 9841...
1          | 9802...

each cell contains one value.

*"1NF does NOT mean "the database is fully normalized."*
It only establishes the first level of structure.
Our redundancy and entity-mixing problems still exist.

## Second Normalization Form (2NF)
order_id | product_id | product_name | quantity
1001     | 10         | Keyboard     | 2
1001     | 20         | Mouse        | 1
1002     | 10         | Keyboard     | 3

here product name depends only on product_id not on order_id . Thats a partial dependency.
2NF says:
*The table must already be in 1NF, and every non-key attribute must depend on the whole primary key.*
order_items
-----------------------------
order_id
product_id
quantity

products
-----------------------------
product_id
product_name

## 3rd Normalization Forrm (3NF)
employees
--------------------------------
employee_id
employee_name
department_id
department_name

here primary key -> employee id , and 
employee_id -> department_id, and
departent_id -> depart name

employee_id → department_id → department_name

deptname doesnot really belongs to the employee. it belongs to the department.

departments
----------------
department_id
department_name


employees
----------------
employee_id
employee_name
department_id

