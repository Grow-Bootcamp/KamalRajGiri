# ACID Property

1. Atomicity — “All or Nothing”
Atomicity means a transaction cannot be partially completed.Either every operation succeeds, or none of them is applied.
MongoDB already guarantees atomicity for a single-document write. Multi-document transactions extend that atomicity across multiple documents.

2. Consistency — “Valid State → Valid State”
Consistency means the database should move from one valid state to another valid state while respecting the rules defined for the data.
Consistency is supported through things such as:
Schema validation
Data constraints
Application/business rules
Atomic writes
Transaction rollback

Important: MongoDB cannot automatically understand every business rule. Your application still has to enforce rules such as “balance cannot become negative.”

3. Isolation — “Transactions Don't See Uncommitted Changes”

A transaction works with a consistent view of the data and its uncommitted changes are not treated as committed database state by other operations.

4. Durability — “Committed Means Saved”
Once the transaction is successfully committed, MongoDB's durability mechanisms ensure the committed data survives normal system failures.

MongoDB uses its WiredTiger storage engine and journaling to provide durability.


Why do we actually need transactions?

Start transaction
       ↓
Update Account A
       ↓
Update Account B
       ↓
     Success?
      ↙   ↘
    YES    NO
     ↓      ↓
   COMMIT  ABORT 
            ↓
         ROLLBACK


# MongoDB Transaction: Session → Transaction → Commit/Rollback
* Why do we need a Session?
In Mongoose, a transaction is associated with a MongoDB session.
The basic lifecycle is:
Create Session
     ↓
Start Transaction
     ↓
Perform database operations
     ↓
Commit OR Abort
     ↓
End Session

The session acts as the context that tells MongoDB:
“These database operations belong to the same transaction.”

* Basic Stucture 

const session = await mongoose.startSession();

try {
    session.startTransaction();

    // database operation 1
    // database operation 2
    // database operation 3

    await session.commitTransaction();

} catch (error) {

    await session.abortTransaction();
    throw error;

} finally {

    await session.endSession();
}


* The important methods are:

| Method                       | Purpose                                        |
| ---------------------------- | ---------------------------------------------- |
| `mongoose.startSession()`    | Creates a MongoDB session                      |
| `session.startTransaction()` | Starts the transaction                         |
| `commitTransaction()`        | Permanently applies transaction changes        |
| `abortTransaction()`         | Cancels the transaction and rolls changes back |
| `endSession()`               | Closes the session                             |


# Transaction-demo Structure
* Model : Define data structure
* Repository : Handles database operations
* Service : Contains business logic, Coordinates transaction
* Controller : Handles HTTP request/response
* Route : Defines API endpoint

