# Learning Log: ACID, Transactions, and Indexing in MySQL

**Date:** 7 October  
**Focus:** Building a reliable bank-transfer workflow and understanding query performance

## What I set out to learn

By the end of this practice, I wanted to be able to:

1. Explain how MySQL supports atomicity, consistency, isolation, and durability.
2. Use `COMMIT`, `ROLLBACK`, and savepoints to control a multi-step operation.
3. Design tables with keys and constraints that protect related data.
4. Create indexes for common access patterns and inspect a query with `EXPLAIN`.

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

## 4. Indexing and query plans

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

## 5. Findings and improvements

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

## 6. Reflection

The most important distinction I learned is that constraints and transactions provide different forms of protection. A foreign key can prevent an invalid account reference, but it cannot ensure that a debit and credit happen together. The transaction provides that atomic boundary, while `EXPLAIN` provides evidence for whether an indexing decision helps a particular query.

I also learned that `ROLLBACK TO` is not the same as a full `ROLLBACK`: it preserves the transaction and changes made before the savepoint. That makes savepoints useful, but also means the remaining changes must be reviewed carefully before the final `COMMIT`.

## Acceptance checklist

- [x] Explain the four ACID properties and how InnoDB supports them.
- [x] Demonstrate a transaction that commits a bank transfer.
- [x] Demonstrate full rollback and partial rollback with a savepoint.
- [x] Define primary keys, unique constraints, `NOT NULL` constraints, and foreign keys.
- [x] Create single-column and composite indexes.
- [x] Use `EXPLAIN` to inspect a status-filtering query.
- [x] Record findings, limitations, and next improvements.

## Related practice files

- [`ACID.sql`](./ACID.sql)
- [`indexing.sql`](./indexing.sql)
- [`Bank-transfer/sql/1-database.sql`](./Bank-transfer/sql/1-database.sql)
- [`Bank-transfer/sql/2-tables.sql`](./Bank-transfer/sql/2-tables.sql)
- [`Bank-transfer/sql/3-seed.sql`](./Bank-transfer/sql/3-seed.sql)
- [`Bank-transfer/sql/4-transaction.sql`](./Bank-transfer/sql/4-transaction.sql)
- [`Bank-transfer/sql/5-indexes.sql`](./Bank-transfer/sql/5-indexes.sql)
- [`Bank-transfer/sql/6-explain.sql`](./Bank-transfer/sql/6-explain.sql)
