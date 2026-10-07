# Transaction
A transaction is a group of database operations that MySQL treats as one logical unit of work.

A reliable database transaction needs to satisfy four important properties:
A → Atomicity
C → Consistency
I → Isolation
D → Durability


## ACID
| Property    | Main question                            |
| ----------- | ---------------------------------------- |
| Atomicity   | Do all operations succeed together?      |
| Consistency | Does the database remain valid?          |
| Isolation   | How do concurrent transactions interact? |
| Durability  | Will committed data survive a crash?     |

### Atomicity means:
Once operations are part of a transaction, their changes can be committed together or rolled back together.

### Consistency means: 
a transaction takes the database from one valid state to another valid state according to the database's rules and constraints.
In MySQL/InnoDB, consistency is supported through things such as:
PRIMARY KEY
FOREIGN KEY
UNIQUE
NOT NULL
CHECK
data types
transaction rules

### Isolation
controls how transactions interact when multiple transactions run concurrently.
*Isolation Prolems*
1. Dirty Read
When transction B reads the updated data from Transaction A but the Transaction rollback after B reads it .
2. Non-repeatable Reade

3. Phantom Read
This is about rows appearing/disappearing from a range query.

#### MySQL Isolation Levels
MySQL/InnoDB supports:
READ UNCOMMITTED
READ COMMITTED
REPEATABLE READ
SERIALIZABLE

### Durability
means committed changes should survive failures.
InnoDB uses mechanisms including its redo log to make committed changes recoverable after crashes.

Atomicity  → all or nothing
Consistency → valid state
Isolation   → controlled concurrency
Durability  → committed data survives failure

## Autocommit
SELECT @@autocommit;

When autocommit is ON, a normal SQL statement is automatically committed if it succeeds.This is why most ordinary MySQL queries don't require you to manually type COMMIT.

But when we do *START TRANSACTION* we explictly enter a transaction. now *update()* doesnot immediately become permanent . we control the ending *COMMIT* or *ROLLBACK*

## Transation Boundaries



## Isolation Levels
MySQL gives four standard isolation levels : think them as increasing protection : 
less isolation
      ↓
READ UNCOMMITTED
      ↓
READ COMMITTED
      ↓
REPEATABLE READ
      ↓
SERIALIZABLE
      ↓
more isolation

But stronger isolation can reduce concurrency and increase locking/waiting.

1. READ UNCOMMITED
This is the weakest. A transaction may read data another transaction has changed but not commited. Therefoore dirty read are possible.Its rarely appropriate for important transactional business data.

2. READ COMMITED
A transaction only sees data commited by other transactions. so once A commits B's Later queries can see the commmited value. this prevents dirty read but another problem still happen Non-repeatable read .
Transaction B queries balance before and after A commits and get different results form same transaction and same row.

3. REPEATABLE READ
This is MySQL InnoDB's default isolation level.
Within a transaction, repeated consistent reads see a consistent snapshot.
You can repeat a read and get a consistent result within the transaction.
InnoDB implements this using MVCC (Multi-Version Concurrency Control) for consistent reads.

4. SERIALIZABLE
This provides the strongest isolation among these four levels. The goal is to make concurrent transaction behave much more like one transaction - finishes - another transaction - finishes , rather than freely overlapping. 
