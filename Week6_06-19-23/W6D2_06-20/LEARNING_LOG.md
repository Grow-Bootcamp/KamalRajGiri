# Learning Log: ACID, Transactions, Indexing, and a Bank-Transfer API

**Date:** 20 June 2023
**Week/Day:** Week 6, Day 2
**Focus:** ACID transactions, indexing, and implementing a bank-transfer workflow with TypeScript, Express, Sequelize, and MySQL

## What I set out to learn

By the end of this practice, I wanted to be able to:

1. Explain how MySQL supports atomicity, consistency, isolation, and durability.
2. Use `COMMIT`, `ROLLBACK`, and savepoints to control a multi-step operation.
3. Design tables with keys and constraints that protect related data.
4. Create indexes for common access patterns and inspect a query with `EXPLAIN`.
5. Connect an Express API to MySQL through Sequelize and keep the transfer steps in one database transaction.

## 1. ACID principles in a bank transfer

ACID describes the guarantees expected from a database transaction:

| Property | Meaning | Example in this exercise |
| --- | --- | --- |
| **Atomicity** | All statements succeed together, or none of them are kept. | The debit, credit, and transaction record belong to one unit of work. |
| **Consistency** | A commit leaves the database satisfying its constraints and rules. | Foreign keys continue to reference real accounts and required values are present. |
| **Isolation** | Work in progress is protected from inappropriate interference by concurrent transactions. | InnoDB transaction isolation prevents other sessions from treating an incomplete transfer as final. |
| **Durability** | Committed changes survive a restart or crash. | InnoDB uses logging and recovery to preserve committed data. |

ACID does not replace application validation. A real transfer must also validate the amount, confirm that the source account exists, check available funds, and handle concurrency correctly.

## 2. Schema and constraints

The bank-transfer project creates an `accounts` table and a `transactions` table. The schema includes:

- An auto-incrementing primary key for each table.
- A `UNIQUE` constraint on account email.
- `NOT NULL` constraints for required account and transaction fields.
- Foreign keys from `transactions.from_account_id` and `transactions.to_account_id` to `accounts.id`.
- A `created_at` timestamp with a default value.

These constraints protect the structure of the data, while transactions protect a sequence of related changes. They solve different problems and work together.

The setup is documented in [`Bank-transfer/sql/1-database.sql`](./Bank-transfer/sql/1-database.sql), [`Bank-transfer/sql/2-tables.sql`](./Bank-transfer/sql/2-tables.sql), and [`Bank-transfer/sql/3-seed.sql`](./Bank-transfer/sql/3-seed.sql).

The standalone [`ACID.sql`](./ACID.sql) file reinforces the same ideas with a smaller
`day4_transactions.accounts` example. The [`ACID.md`](./ACID.md) notes cover ACID,
autocommit, transaction boundaries, isolation problems, and savepoints in more detail.

## 3. Transaction control

| Statement | Purpose |
| --- | --- |
| `START TRANSACTION` | Begins an explicit transaction. |
| `COMMIT` | Makes the remaining changes permanent. |
| `ROLLBACK` | Discards all changes since the transaction began. |
| `SAVEPOINT name` | Marks a point to which the transaction can partially return. |
| `ROLLBACK TO name` | Undoes changes after the savepoint but keeps the transaction active. |

### Committing a complete transfer

A transfer should debit the sender, credit the recipient, and record the event before committing:

```sql
START TRANSACTION;

UPDATE accounts
SET balance = balance - 200
WHERE id = 1;

UPDATE accounts
SET balance = balance + 200
WHERE id = 2;

INSERT INTO transactions
    (from_account_id, to_account_id, amount, status)
VALUES
    (1, 2, 200, 'COMPLETED');

COMMIT;
```

The important point is the transaction boundary: committing after only one balance update would create an inconsistent result. In application code, any failed statement or failed validation should lead to `ROLLBACK`.

### Rolling back a failed operation

The rollback exercise demonstrates that changes made after `START TRANSACTION` can be inspected inside the transaction and then discarded:

```sql
START TRANSACTION;

UPDATE accounts
SET balance = balance - 100
WHERE id = 1;

UPDATE accounts
SET balance = balance + 100
WHERE id = 2;

ROLLBACK;
```

After the rollback, both balances return to their values from before the transaction.

### Partially undoing work with a savepoint

Savepoints are useful when a workflow has several stages and only the later stage needs to be retried:

```sql
START TRANSACTION;

UPDATE accounts
SET balance = balance - 50
WHERE id = 1;

SAVEPOINT after_debit;

UPDATE accounts
SET balance = balance + 50
WHERE id = 2;

ROLLBACK TO after_debit;
COMMIT;
```

`ROLLBACK TO after_debit` keeps the debit and removes the later credit. The final `COMMIT` then persists the changes that remain, so a savepoint should only be used when that partial result is intentional.

## 4. Additional transaction concepts from `ACID.md`

### Autocommit and transaction boundaries

MySQL commonly has `autocommit` enabled, which commits a successful standalone
statement automatically. Explicit transactions create a boundary around several
related statements:

```sql
START TRANSACTION;
-- related operations
COMMIT;   -- successful end
-- or ROLLBACK; -- undo the current transaction
```

`ROLLBACK` undoes all changes made by the current transaction; it does not only undo
the last statement. A savepoint is different because `ROLLBACK TO savepoint_name`
undoes only the work after that marker and leaves the transaction active.

### Isolation levels

Isolation controls the trade-off between concurrency and protection from other
transactions:

| Level | Learning |
| --- | --- |
| `READ UNCOMMITTED` | Allows dirty reads of uncommitted changes. |
| `READ COMMITTED` | Prevents dirty reads, but the same row can change between reads. |
| `REPEATABLE READ` | MySQL InnoDB's default; consistent reads normally use one snapshot. |
| `SERIALIZABLE` | Strongest isolation; concurrent work behaves more sequentially, with more waiting and lower concurrency. |

The main concurrency problems are dirty reads, non-repeatable reads, and phantom
reads. InnoDB uses MVCC (Multi-Version Concurrency Control) for consistent reads.
When a transaction must coordinate a row before modifying it, a locking read such
as `SELECT ... FOR UPDATE` can be used instead of a normal consistent read.

### Index types, selectivity, and query design

The extended indexing study covered more than creating an index:

- InnoDB normally uses a B-tree/B+tree-style structure to narrow lookups.
- A primary key is automatically indexed.
- A unique index both speeds lookups and prevents duplicate values.
- A single-column index is appropriate for a focused access pattern such as filtering employees by department.
- A composite index such as `(department, salary)` can support `department` alone or `department` plus `salary`, but generally cannot efficiently support `salary` alone.
- Composite column order follows the leftmost-prefix principle and must match the query's filtering and sorting pattern.
- Selectivity measures how effectively a column narrows results: email is usually more selective than a low-cardinality department or status column.

Indexes can support joins through foreign-key and join columns, and a composite
index such as `(status, created_at)` can support both filtering by status and
ordering by creation time. However, the optimizer still decides whether the index
is cheaper than a table scan.

Indexes are not free: they consume storage and add work to `INSERT`, `UPDATE`, and
`DELETE`. Overlapping indexes such as `(department)` and `(department, salary)`
may be redundant. Small tables, low-selectivity columns, rarely searched columns,
and applications with too many indexes are cases where an index may not help.

### Reading `EXPLAIN`

`EXPLAIN` describes the optimizer's planned execution strategy. Important fields
include:

- `type`: the access method, such as `ALL` for a full table scan or `ref` for an indexed lookup.
- `possible_keys`: indexes that could potentially be used.
- `key`: the index actually selected.
- `rows`: the estimated rows to examine, not necessarily the exact physical count.
- `filtered`: the estimated percentage that passes the condition.
- `Extra`: additional execution details.

The `ACID.md` example showed a query changing from `type = ALL`, `key = NULL`,
and a high row estimate to an indexed `ref` lookup after an appropriate
department index was added. This demonstrated the effect of an index on a larger
table while also reinforcing that real query plans should be measured rather than
assumed.

## 5. TypeScript bank-transfer API

The SQL exercise was also implemented as a small Express API in
[`Bank-transfer/src`](./Bank-transfer/src). The setup uses `express`, `sequelize`,
`mysql2`, and `dotenv`; TypeScript is compiled with the strict options in
[`Bank-transfer/src/tsconfig.json`](./Bank-transfer/src/tsconfig.json).

### Application structure

- [`config/db.ts`](./Bank-transfer/src/config/db.ts) loads environment variables and creates the Sequelize MySQL connection.
- [`models/account.model.ts`](./Bank-transfer/src/models/account.model.ts) maps the `accounts` table and enforces required fields plus unique email values.
- [`models/transaction.model.ts`](./Bank-transfer/src/models/transaction.model.ts) maps transfer records and their status and timestamp fields.
- [`repo/account.repo.ts`](./Bank-transfer/src/repo/account.repo.ts) reads accounts and increments or decrements balances using the active transaction.
- [`repo/transaction.repo.ts`](./Bank-transfer/src/repo/transaction.repo.ts) records a completed transfer using the same transaction.
- [`services/transfer.services.ts`](./Bank-transfer/src/services/transfer.services.ts) owns the transfer workflow and transaction boundary.
- [`controllers/transfer.controller.ts`](./Bank-transfer/src/controllers/transfer.controller.ts) translates the HTTP request into a service call and returns JSON responses.
- [`routes/transfer.routes.ts`](./Bank-transfer/src/routes/transfer.routes.ts) exposes `POST /api/transfer`.
- [`app.ts`](./Bank-transfer/src/app.ts) enables JSON parsing, registers the routes, authenticates the database connection, and starts the server on port 3000.

### Transfer request flow

The API receives `fromAccountId`, `toAccountId`, and `amount` in the request body. The
service then:

1. Starts a Sequelize transaction.
2. Loads the sender account inside that transaction.
3. Rejects a missing sender or an insufficient balance.
4. Decrements the sender and increments the recipient.
5. Inserts a `COMPLETED` transaction record.
6. Commits only after every operation succeeds.
7. Rolls back and rethrows the error if any operation fails.

This is the application equivalent of the SQL `START TRANSACTION`/`COMMIT`/`ROLLBACK`
examples. Repository methods receive the same Sequelize transaction object, so the
balance updates and audit record share one atomic boundary.

The project was validated with `npm run build`; the strict TypeScript compilation
completed successfully.

### Implementation limitations identified

The current practice implementation still needs production-level validation before it
could handle real money:

- Validate that the amount is a positive finite value and that the source and destination IDs are different.
- Verify that the destination account exists before completing the transfer.
- Check the affected-row counts from balance updates.
- Add database-level foreign keys to the Sequelize model configuration if the schema is created through Sequelize.
- Return consistent status codes for validation, missing accounts, and database failures.
- Configure locking or an appropriate isolation strategy for concurrent transfers.

## 6. Indexing and query plans

An index is a separate data structure that helps MySQL find matching rows more efficiently. The trade-offs are:

- **Benefit:** faster reads for queries that match the indexed columns.
- **Cost:** extra storage and additional work when rows are inserted, updated, or deleted.
- **Limitation:** an index is useful only when it matches the query pattern and the optimizer chooses it.

The exercise creates the following indexes in [`Bank-transfer/sql/5-indexes.sql`](./Bank-transfer/sql/5-indexes.sql):

```sql
CREATE INDEX idx_transactions_status
ON transactions(status);

CREATE INDEX idx_transactions_from_account
ON transactions(from_account_id);

CREATE INDEX idx_status_created
ON transactions(status, created_at);
```

The query in [`Bank-transfer/sql/6-explain.sql`](./Bank-transfer/sql/6-explain.sql) can be inspected with:

```sql
EXPLAIN
SELECT *
FROM transactions
WHERE status = 'COMPLETED';
```

`EXPLAIN` helps answer:

- Which access method MySQL plans to use.
- Whether an index is selected.
- How many rows MySQL estimates it will examine.
- Which columns and key length are involved in the lookup.

The composite index `(status, created_at)` follows the leftmost-prefix rule. It can support queries beginning with `status`, especially when they also filter or sort by `created_at`; it is not generally an equally effective index for a query using only `created_at`.

## 7. Findings and improvements

### Consistent status values

The original practice files insert `'Completed'` but the `EXPLAIN` example searches for `'COMPLETED'`. Depending on the column collation, these may or may not compare as equal. I used `'COMPLETED'` consistently in the example above. A production schema should document allowed statuses and enforce them with an appropriate constraint or enum.

### Matching the correct schema

The standalone [`ACID.sql`](./ACID.sql) example uses `account_id`, while the bank-transfer project uses `id`. The queries are not interchangeable without adapting the column names and database selection.

### Interpreting index results carefully

The seed data contains only a few rows. For such a small table, MySQL may choose a table scan even when an index exists because that can be cheaper. Index performance should be measured with representative data and an actual `EXPLAIN` plan rather than assumed from the index definition alone.

### Protecting the transfer from invalid state

The SQL demonstrates transaction mechanics, but a production implementation should also:

- Reject zero or negative transfer amounts.
- Check the sender has sufficient funds.
- Confirm both accounts exist before updating.
- Verify that the expected rows were updated.
- Use suitable locking or isolation for concurrent transfers.
- Roll back on errors and only commit after every required step succeeds.

## 8. Reflection

The most important distinction I learned is that constraints and transactions provide different forms of protection. A foreign key can prevent an invalid account reference, but it cannot ensure that a debit and credit happen together. The transaction provides that atomic boundary, while `EXPLAIN` provides evidence for whether an indexing decision helps a particular query.

I also learned that `ROLLBACK TO` is not the same as a full `ROLLBACK`: it preserves the transaction and changes made before the savepoint. That makes savepoints useful, but also means the remaining changes must be reviewed carefully before the final `COMMIT`.

## Acceptance checklist

- [x] Explain the four ACID properties and how InnoDB supports them.
- [x] Demonstrate a transaction that commits a bank transfer.
- [x] Demonstrate full rollback and partial rollback with a savepoint.
- [x] Explain autocommit and transaction boundaries.
- [x] Compare all four MySQL isolation levels and identify dirty, non-repeatable, and phantom reads.
- [x] Explain MVCC and locking reads with `FOR UPDATE`.
- [x] Define primary keys, unique constraints, `NOT NULL` constraints, and foreign keys.
- [x] Create single-column and composite indexes.
- [x] Explain B-tree indexes, selectivity, leftmost-prefix behavior, join/order-by indexes, and redundant indexes.
- [x] Use `EXPLAIN` to inspect a status-filtering query.
- [x] Explain when an index may not improve performance and why indexes increase write cost.
- [x] Record findings, limitations, and next improvements.
- [x] Build the TypeScript bank-transfer API with Express, Sequelize, and MySQL configuration.
- [x] Pass one Sequelize transaction through the repositories and service.
- [x] Validate the TypeScript project with `npm run build`.

## Related practice files

- [`ACID.sql`](./ACID.sql)
- [`indexing.sql`](./indexing.sql)
- [`Bank-transfer/sql/1-database.sql`](./Bank-transfer/sql/1-database.sql)
- [`Bank-transfer/sql/2-tables.sql`](./Bank-transfer/sql/2-tables.sql)
- [`Bank-transfer/sql/3-seed.sql`](./Bank-transfer/sql/3-seed.sql)
- [`Bank-transfer/sql/4-transaction.sql`](./Bank-transfer/sql/4-transaction.sql)
- [`Bank-transfer/sql/5-indexes.sql`](./Bank-transfer/sql/5-indexes.sql)
- [`Bank-transfer/sql/6-explain.sql`](./Bank-transfer/sql/6-explain.sql)
- [`ACID.md`](./ACID.md)
- [`Bank-transfer/src/setup.md`](./Bank-transfer/src/setup.md)
- [`Bank-transfer/src/package.json`](./Bank-transfer/src/package.json)
- [`Bank-transfer/src/app.ts`](./Bank-transfer/src/app.ts)
- [`Bank-transfer/src/config/db.ts`](./Bank-transfer/src/config/db.ts)
- [`Bank-transfer/src/models/account.model.ts`](./Bank-transfer/src/models/account.model.ts)
- [`Bank-transfer/src/models/transaction.model.ts`](./Bank-transfer/src/models/transaction.model.ts)
- [`Bank-transfer/src/repo/account.repo.ts`](./Bank-transfer/src/repo/account.repo.ts)
- [`Bank-transfer/src/repo/transaction.repo.ts`](./Bank-transfer/src/repo/transaction.repo.ts)
- [`Bank-transfer/src/services/transfer.services.ts`](./Bank-transfer/src/services/transfer.services.ts)
- [`Bank-transfer/src/controllers/transfer.controller.ts`](./Bank-transfer/src/controllers/transfer.controller.ts)
- [`Bank-transfer/src/routes/transfer.routes.ts`](./Bank-transfer/src/routes/transfer.routes.ts)
- [`Bank-transfer/src/tsconfig.json`](./Bank-transfer/src/tsconfig.json)
