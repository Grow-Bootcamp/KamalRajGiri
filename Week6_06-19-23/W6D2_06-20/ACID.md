# 1. Transaction

A **transaction** is a group of database operations that MySQL treats as one logical unit of work.

A reliable transaction follows the **ACID** properties:

* **A → Atomicity**
* **C → Consistency**
* **I → Isolation**
* **D → Durability**

---

# 2. ACID Properties

| Property    | Meaning                                                                       |
| ----------- | ----------------------------------------------------------------------------- |
| Atomicity   | All operations succeed together or are rolled back together.                  |
| Consistency | The database remains in a valid state according to its rules and constraints. |
| Isolation   | Concurrent transactions do not incorrectly interfere with each other.         |
| Durability  | Committed changes survive failures such as a crash.                           |

## 2.1 Atomicity

Atomicity means **all or nothing**.

If several operations belong to one transaction, they can be committed together or rolled back together.

```sql
START TRANSACTION;

UPDATE accounts
SET balance = balance - 100
WHERE id = 1;

UPDATE accounts
SET balance = balance + 100
WHERE id = 2;

COMMIT;
```

If something goes wrong:

```sql
ROLLBACK;
```

The changes made by the transaction are undone.

**Atomicity → All or nothing**

---

## 2.2 Consistency

Consistency means a transaction takes the database from **one valid state to another valid state** according to the database's rules and constraints.

Consistency is supported by:

* PRIMARY KEY
* FOREIGN KEY
* UNIQUE
* NOT NULL
* CHECK
* Data types
* Transaction rules

Example:

A FOREIGN KEY prevents a transaction from creating a reference to a non-existing account.

**Consistency → Valid database state**

---

## 2.3 Isolation

Isolation controls how transactions interact when multiple transactions execute concurrently.

It prevents one transaction from incorrectly seeing or interfering with another transaction's intermediate work.

### Common Isolation Problems

#### 1. Dirty Read

Transaction B reads data changed by Transaction A before A commits.

If A later rolls back, B has read data that was never permanently committed.

```text
Transaction A → UPDATE
       ↓
   no COMMIT
       ↓
Transaction B → reads changed value
       ↓
Transaction A → ROLLBACK
```

#### 2. Non-Repeatable Read

A transaction reads the same row twice but gets different values because another transaction updated and committed that row between the two reads.

#### 3. Phantom Read

The same range query returns a different set of rows because another transaction inserted, deleted, or changed rows that match the query.

Example:

```sql
SELECT *
FROM accounts
WHERE balance > 500;
```

The second execution may return additional matching rows after another transaction commits a change.

---

## 2.4 Durability

Durability means **committed changes should survive failures**.

InnoDB uses mechanisms including its **redo log** to make committed changes recoverable after crashes.

**Durability → Committed data survives failure**

---

# 3. Autocommit

Check the current setting:

```sql
SELECT @@autocommit;
```

When `autocommit` is ON, a normal SQL statement is automatically committed if it succeeds.

Therefore, most ordinary MySQL statements do not require manually typing `COMMIT`.

When we explicitly start a transaction:

```sql
START TRANSACTION;
```

changes are controlled by:

```sql
COMMIT;
```

or:

```sql
ROLLBACK;
```

Example:

```text
Autocommit ON
     ↓
UPDATE
     ↓
Automatically committed

START TRANSACTION
     ↓
UPDATE
     ↓
COMMIT / ROLLBACK
```

---

# 4. Transaction Boundaries

A transaction boundary defines where a transaction starts and ends.

### Start

```sql
START TRANSACTION;
```

### Successful end

```sql
COMMIT;
```

### Undo changes

```sql
ROLLBACK;
```

Basic flow:

```text
START TRANSACTION
       ↓
 SQL operations
       ↓
  ┌────┴────┐
  ↓         ↓
COMMIT   ROLLBACK
  ↓         ↓
Permanent   Undo
```

### Important

`ROLLBACK` does not simply mean "undo the last query."

It undoes the changes made by the current transaction.

---

# 5. SAVEPOINT

A **SAVEPOINT** allows partial rollback inside a transaction.

```sql
START TRANSACTION;

UPDATE accounts
SET balance = balance - 50
WHERE id = 1;

SAVEPOINT after_kamal;

UPDATE accounts
SET balance = balance + 50
WHERE id = 2;

ROLLBACK TO after_kamal;

COMMIT;
```

Flow:

```text
START
  ↓
Operation 1
  ↓
SAVEPOINT
  ↓
Operation 2
  ↓
ROLLBACK TO SAVEPOINT
  ↓
Operation 2 undone
  ↓
COMMIT
```

### Difference

```text
ROLLBACK
→ Undo transaction changes

ROLLBACK TO savepoint
→ Undo changes made after the savepoint
```

---

# 6. Isolation Levels

MySQL/InnoDB provides four standard isolation levels:

```text
Less isolation
      ↓
READ UNCOMMITTED
      ↓
READ COMMITTED
      ↓
REPEATABLE READ
      ↓
SERIALIZABLE
      ↓
More isolation
```

Stronger isolation can provide more protection but may reduce concurrency and increase locking/waiting.

---

## 6.1 READ UNCOMMITTED

The weakest isolation level.

A transaction can read changes made by another transaction before they are committed.

**Dirty reads are possible.**

```text
A → UPDATE
      ↓
   no COMMIT
      ↓
B → reads A's change
      ↓
A → ROLLBACK
```

The value read by B may never become permanent.

---

## 6.2 READ COMMITTED

A transaction only sees data committed by other transactions.

It prevents **dirty reads**.

However, **non-repeatable reads can occur**.

Example:

```text
Transaction B → reads 900

Transaction A → changes to 1000
Transaction A → COMMIT

Transaction B → reads again

Result → 1000
```

The same row produced different results inside Transaction B.

---

## 6.3 REPEATABLE READ

`REPEATABLE READ` is the **default isolation level for MySQL InnoDB**.

Within a transaction, repeated consistent reads normally see a consistent snapshot.

InnoDB uses **MVCC (Multi-Version Concurrency Control)** for consistent reads.

MVCC allows transactions to access appropriate versions of data without every normal read having to wait for other transactions.

### Locking read

A query such as:

```sql
SELECT *
FROM accounts
WHERE id = 1
FOR UPDATE;
```

is different from a normal consistent `SELECT`.

`FOR UPDATE` is a locking read used when a transaction intends to modify or coordinate access to the selected rows.

---

## 6.4 SERIALIZABLE

The strongest standard isolation level.

It makes concurrent transactions behave more like they are executed sequentially rather than freely overlapping.

```text
Transaction A
     ↓
   Finish
     ↓
Transaction B
     ↓
   Finish
```

Advantages:

* Strong isolation
* Stronger protection from concurrency problems

Disadvantages:

* More locking/waiting
* Lower concurrency

---

# 7. Indexing

## What is Indexing?

An **index** is a separate data structure that helps MySQL find rows faster without scanning the entire table.

### Without index

```text
Check Row 1
Check Row 2
Check Row 3
Check Row 4
...
```

### With index

```text
Search Index
     ↓
Find matching value
     ↓
Locate required rows
```

InnoDB commonly uses a **B-tree/B+tree-style structure** for normal indexes.

The tree allows MySQL to narrow down the search efficiently.

---

# 8. Why Not Index Every Column?

Indexes have costs.

Every index:

* Uses storage
* Requires maintenance
* Can increase INSERT cost
* Can increase UPDATE cost
* Can increase DELETE cost

Therefore:

> Create indexes based on actual query patterns rather than indexing every column.

---

# 9. Primary Key Index

A PRIMARY KEY is automatically indexed.

```sql
CREATE TABLE accounts (
    id INT PRIMARY KEY,
    account_name VARCHAR(100)
);
```

The `id` column automatically gets an index.

---

# 10. Unique Index

A UNIQUE index provides indexing while preventing duplicate values.

```sql
CREATE UNIQUE INDEX idx_employee_email
ON employees(email);
```

Two employees cannot have the same email.

---

# 11. Single-Column Index

An index can be created on one column.

```sql
CREATE INDEX idx_employees_department
ON employees(department);
```

Useful for queries such as:

```sql
SELECT *
FROM employees
WHERE department = 'IT';
```

---

# 12. Composite Index

A composite index contains multiple columns.

```sql
CREATE INDEX idx_department_salary
ON employees(department, salary);
```

The column order matters.

```text
(department, salary)
       ↑       ↑
     first   second
```

Useful for:

```sql
WHERE department = 'IT';
```

and:

```sql
WHERE department = 'IT'
AND salary > 50000;
```

But:

```sql
WHERE salary > 50000;
```

generally cannot use `(department, salary)` efficiently for a direct lookup because `salary` is not the leftmost column.

---

# 13. Leftmost-Prefix Principle

For:

```text
(department, salary)
```

the index begins with `department`.

Therefore:

```text
department
department + salary
```

can generally benefit from the index.

But:

```text
salary
```

alone generally cannot use it efficiently for direct lookup.

Therefore, **composite index column order matters**.

---

# 14. Index Selectivity

**Selectivity** describes how effectively a column can narrow down the number of matching rows.

### High selectivity

```text
email
```

Many rows can have different email values.

### Low selectivity

```text
department
```

If thousands of employees belong to only a few departments.

High-selectivity columns are often better index candidates, especially for equality searches.

However, selectivity is not the only factor. The MySQL optimizer considers the entire query and table statistics.

---

# 15. EXPLAIN

`EXPLAIN` shows how MySQL plans to execute a query.

```sql
EXPLAIN
SELECT *
FROM employees
WHERE department = 'IT';
```

Important fields:

| Field           | Meaning                                    |
| --------------- | ------------------------------------------ |
| `type`          | Access method used by MySQL                |
| `possible_keys` | Indexes that could potentially be used     |
| `key`           | Index actually selected                    |
| `rows`          | Estimated rows to examine                  |
| `filtered`      | Estimated percentage passing the condition |
| `Extra`         | Additional execution information           |

### Common `type` values

`ALL` → Full table scan

`ref` → Indexed lookup using a non-unique index

### Example

Before index:

```text
type = ALL
key  = NULL
rows = 9818
```

After creating:

```sql
CREATE INDEX idx_large_department
ON employees_large(department);
```

The same query produced:

```text
type = ref
key  = idx_large_department
rows = 2500
```

This demonstrated that the index allowed MySQL to narrow the search to the matching department rows.

`rows` is an optimizer estimate, not necessarily the exact number of rows physically read.

---

# 16. Indexes with JOIN

Indexes can improve queries involving JOIN conditions.

Example:

```sql
SELECT s.name, c.name
FROM students s
JOIN student_courses sc
    ON s.id = sc.student_id
JOIN courses c
    ON c.id = sc.course_id;
```

Primary keys such as:

```text
students.id
courses.id
```

are already indexed.

Columns such as:

```text
student_courses.student_id
student_courses.course_id
```

can also benefit from suitable indexes.

InnoDB may automatically create an index for a foreign-key column if a suitable index does not already exist.

---

# 17. Indexes with ORDER BY

Indexes can also help queries involving filtering and sorting.

Example:

```sql
SELECT *
FROM transactions
WHERE status = 'COMPLETED'
ORDER BY created_at;
```

A composite index can be designed for this query:

```sql
CREATE INDEX idx_status_created
ON transactions(status, created_at);
```

The index follows the query pattern:

```text
status → filter
created_at → ordering
```

The optimizer still decides whether using the index is cheaper.

---

# 18. Redundant / Overlapping Indexes

Consider:

```text
idx_department
(department)

idx_department_salary
(department, salary)
```

The composite index already starts with `department`.

Therefore, the two indexes overlap.

Too many overlapping indexes can cause:

* Extra storage
* More INSERT work
* More UPDATE work
* More DELETE work
* Additional index maintenance

Indexes should therefore be reviewed based on actual application queries.

---

# 19. When NOT to Create an Index

### Small tables

For a very small table, a full table scan may be faster.

### Low-selectivity columns

For example:

```text
status → Active / Inactive
```

If a query matches a large percentage of the table, MySQL may prefer a full scan.

### Rarely searched columns

Do not index a column simply because it exists.

### Too many indexes

Excessive indexes increase storage and write-maintenance costs.

### Important rule

> An index does not always make a query faster.

The optimizer decides whether to use an index based on factors such as:

* Table size
* Selectivity
* Query conditions
* Available indexes
* Estimated execution cost

---

# 20. Sequelize Transactions

Sequelize can implement database transactions from the application layer.

Basic structure:

```ts
const t = await sequelize.transaction();

try {

    // Database operations

    await t.commit();

} catch (error) {

    await t.rollback();

    throw error;
}
```

Every database operation belonging to the transaction must receive:

```ts
{ transaction: t }
```

Example:

```ts
await Account.decrement(
    { balance: amount },
    {
        where: { id: fromAccountId },
        transaction: t
    }
);
```

### Transaction Flow

```text
Start transaction
       ↓
Operation 1
       ↓
Operation 2
       ↓
Operation 3
       ↓
     COMMIT
```

If any operation fails:

```text
Operation fails
       ↓
    ROLLBACK
       ↓
All transaction changes undone
```

This provides the same **all-or-nothing behavior** demonstrated using raw MySQL transactions.

---

# 21. Day 4 Quick Revision

```text
TRANSACTION
     ↓
    ACID
     ↓
 ┌───┼───────────────┐
 ↓   ↓       ↓       ↓
 A   C       I       D
 ↓   ↓       ↓       ↓
All  Valid  Controlled  Survives
or   State  Concurrency Failure
Nothing
```

```text
TRANSACTIONS
    ↓
START TRANSACTION
    ↓
SQL Operations
    ↓
COMMIT / ROLLBACK
    ↓
SAVEPOINT for partial rollback
```

```text
ISOLATION
    ↓
READ UNCOMMITTED
    ↓
READ COMMITTED
    ↓
REPEATABLE READ
    ↓
SERIALIZABLE
```

```text
INDEXING
    ↓
Single-column
    ↓
Unique
    ↓
Composite
    ↓
Selectivity
    ↓
Leftmost Prefix
    ↓
EXPLAIN
    ↓
JOIN / ORDER BY
    ↓
Redundant Indexes
    ↓
When NOT to Index
```

```text
SEQUELIZE
    ↓
Model
    ↓
Repository
    ↓
Service
    ↓
Transaction
    ↓
COMMIT / ROLLBACK
```

# Key Points to Remember

* **Atomicity** → All or nothing
* **Consistency** → Valid state
* **Isolation** → Controlled concurrency
* **Durability** → Committed data survives failure
* **COMMIT** → Make transaction changes permanent
* **ROLLBACK** → Undo transaction changes
* **SAVEPOINT** → Allow partial rollback
* **REPEATABLE READ** → MySQL/InnoDB default
* **MVCC** → Helps provide consistent reads
* **Index** → Helps locate rows efficiently
* **Composite index order matters**
* **EXPLAIN** → Shows the query execution plan
* **`key`** → Index actually chosen
* **`possible_keys`** → Indexes that could be considered
* **`rows`** → Estimated rows examined
* **Too many indexes** → More storage and write overhead
* **Sequelize transactions** → Use `sequelize.transaction()` and pass `{ transaction: t }` to participating operations
