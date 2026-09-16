# Day 1: Database & MongoDB — Learning Log

## 1. Overview

Today I learned the fundamentals of databases, relational and non-relational database concepts, SQL vs NoSQL databases, ORM, and MongoDB.

I also completed a practical MongoDB setup on Windows, including MongoDB Community Server, MongoDB Shell (`mongosh`), MongoDB Compass, and the MongoDB extension for VS Code.

Finally, I created a MongoDB database and collection and performed basic CRUD operations using MongoDB Shell.

---

# 2. What is a Database?

A database is a system used to store, organize, manage, and retrieve data efficiently.

Applications need databases because application data needs to:

* Persist after the application is closed.
* Be retrieved efficiently.
* Be created, updated, and deleted.
* Be organized logically.
* Support relationships between related data.
* Be accessed by multiple users or application processes.
* Maintain data consistency and integrity.

### Application Architecture

A basic application can be understood as:

```text
Frontend
   ↓
Backend / API
   ↓
Database
```

The frontend presents information to the user, the backend contains application logic and APIs, and the database stores and manages persistent data.

---

# 3. CRUD

CRUD represents the four fundamental operations performed on stored data.

| Operation | Meaning                |
| --------- | ---------------------- |
| Create    | Add new data           |
| Read      | Retrieve existing data |
| Update    | Modify existing data   |
| Delete    | Remove data            |

CRUD is common across both SQL and NoSQL databases, although the commands and APIs used to perform the operations differ.

---

# 4. SQL and Relational Databases

SQL stands for **Structured Query Language**.

SQL is commonly used to interact with relational databases.

A relational database organizes data into tables and represents relationships between tables.

## Main Relational Concepts

### Database

A container that contains related tables and other database objects.

### Table

Stores data in rows and columns.

### Row

Represents one record.

### Column

Represents a particular attribute or property of the records.

Example:

```text
students

+----+-------+-----+----------------------+
| id | name  | age | course               |
+----+-------+-----+----------------------+
| 1  | Kamal | 24  | Computer Engineering |
+----+-------+-----+----------------------+
```

### Primary Key

A primary key uniquely identifies a record in a table.

Example:

```text
id = 1
```

### Foreign Key

A foreign key creates a relationship between tables by referring to a key in another table.

---

# 5. Relationships in Relational Databases

Common database relationships include:

### One-to-One

One record is associated with one record.

```text
Person → Passport
```

### One-to-Many

One record can be associated with multiple records.

```text
Department → Students
```

### Many-to-Many

Multiple records can be associated with multiple records.

```text
Students ↔ Courses
```

A many-to-many relationship is commonly implemented using an intermediate/junction table.

---

# 6. SQL CRUD Commands

The basic SQL CRUD operations are:

```sql
INSERT
SELECT
UPDATE
DELETE
```

Example:

```sql
INSERT INTO students (name, age)
VALUES ('Kamal', 24);
```

```sql
SELECT * FROM students;
```

```sql
UPDATE students
SET age = 25
WHERE name = 'Kamal';
```

```sql
DELETE FROM students
WHERE name = 'Kamal';
```

---

# 7. Schema

A schema describes the structure of data.

In a traditional relational database, a schema commonly defines:

* Tables
* Columns
* Data types
* Constraints
* Relationships

Example:

```text
students
│
├── id       → INTEGER
├── name     → VARCHAR
├── age      → INTEGER
└── course   → VARCHAR
```

Relational databases generally expect a more structured and predefined schema.

---

# 8. NoSQL Databases

NoSQL is commonly interpreted as **"Not Only SQL."**

NoSQL refers to a group of non-relational database approaches.

Common NoSQL models include:

| Type        | Example   |
| ----------- | --------- |
| Document    | MongoDB   |
| Key-Value   | Redis     |
| Wide-Column | Cassandra |
| Graph       | Neo4j     |

NoSQL does not mean that databases have no structure. Different NoSQL databases use different data models and can still have well-designed schemas.

---

# 9. Document-Oriented Databases

MongoDB is a document-oriented NoSQL database.

Instead of primarily organizing data into tables and rows, MongoDB stores data as documents.

Documents can contain:

* Fields
* Arrays
* Nested objects
* Different data types

Example:

```javascript
{
  name: "Kamal",
  age: 24,
  course: "Computer Engineering",
  skills: ["JavaScript", "Node.js", "MongoDB"]
}
```

A nested document can also be used:

```javascript
{
  name: "Kamal",
  address: {
    city: "Mahendranagar",
    country: "Nepal"
  }
}
```

---

# 10. SQL vs NoSQL

| Feature                 | SQL                                              | NoSQL                                                 |
| ----------------------- | ------------------------------------------------ | ----------------------------------------------------- |
| Data model              | Relational                                       | Non-relational                                        |
| Main structure          | Tables                                           | Depends on database model                             |
| MongoDB-style structure | Not applicable                                   | Documents / collections                               |
| Schema                  | Generally predefined/structured                  | Often flexible                                        |
| Relationships           | Strong relational model                          | Can embed or reference                                |
| Query language          | SQL                                              | Database-specific APIs/languages                      |
| Scaling                 | Often vertical; horizontal scaling also possible | Many systems designed with horizontal scaling in mind |
| Best suited for         | Structured relational data                       | Flexible, distributed, or document-oriented use cases |

## When SQL is suitable

SQL databases are often suitable for:

* Banking systems
* Accounting systems
* Payroll
* University systems
* ERP systems
* Applications with complex relationships
* Systems requiring strong transactional consistency

## When NoSQL may be suitable

NoSQL can be useful for:

* Rapidly changing data structures
* Large-scale distributed applications
* Document-oriented applications
* Content-oriented systems
* Applications where nested data naturally fits the document model

The choice should be based on application requirements rather than assuming one type is always better.

---

# 11. ACID Transactions

ACID describes important transaction properties.

### Atomicity

A transaction happens completely or does not happen.

### Consistency

A transaction should leave data in a valid state according to the database's rules.

### Isolation

Concurrent transactions should not improperly interfere with each other.

### Durability

Once a transaction is committed, its changes should persist.

Modern SQL and NoSQL databases can both support transactions, although capabilities and implementation details differ.

---

# 12. ORM

ORM stands for **Object-Relational Mapping**.

ORM provides a bridge between application objects and relational database structures.

Typical mapping:

```text
Application              Relational Database

Class        ─────────→  Table
Object       ─────────→  Row
Property     ─────────→  Column
```

Examples of ORM tools include:

* Sequelize
* TypeORM
* Prisma
* Hibernate
* Entity Framework

## Benefits of ORM

* Reduces repetitive SQL code.
* Provides an application-level abstraction.
* Makes database operations easier to integrate with application code.
* Helps represent relationships.
* Can improve developer productivity.
* Can provide validation and migration-related features depending on the ORM.

## Limitations

* Adds an abstraction layer.
* Can generate inefficient queries if used incorrectly.
* Complex queries may sometimes be easier to write directly in SQL.
* Developers still benefit from understanding SQL and database concepts.

### ORM vs MongoDB

MongoDB is not a relational database.

For MongoDB, tools such as **Mongoose** are commonly described as ODMs (Object Data Modeling tools), rather than ORMs.

---

# 13. MongoDB

MongoDB is a document-oriented NoSQL database.

The main MongoDB hierarchy learned today is:

```text
MongoDB Server
    ↓
Database
    ↓
Collection
    ↓
Document
    ↓
Fields
```

---

# 14. MongoDB Database

A database contains collections.

Today I created:

```text
bootcamp_db
```

I switched to it using:

```javascript
use bootcamp_db
```

Important observation:

Running `use bootcamp_db` switches the current database context. The database becomes visible in `show dbs` after data/metadata has been created.

---

# 15. MongoDB Collection

A collection is a group of related documents.

I created:

```text
students
```

using:

```javascript
db.createCollection("students")
```

The result was:

```text
{ ok: 1 }
```

I verified the collection using:

```javascript
show collections
```

Output:

```text
students
```

---

# 16. MongoDB Document

A document is an individual record stored inside a collection.

I inserted:

```javascript
db.students.insertOne({
  name: "Kamal",
  age: 23,
  course: "Computer Engineering"
})
```

MongoDB returned an automatically generated `_id`:

```text
ObjectId(...)
```

The document was then conceptually:

```javascript
{
  _id: ObjectId("..."),
  name: "Kamal",
  age: 23,
  course: "Computer Engineering"
}
```

---

# 17. MongoDB `_id`

Every MongoDB document has a unique `_id` field.

If an `_id` is not supplied during insertion, MongoDB normally generates one automatically.

A common automatically generated identifier is:

```javascript
ObjectId(...)
```

The `_id` is used to uniquely identify a document.

---

# 18. BSON

MongoDB stores documents internally using **BSON**, which stands for Binary JSON.

BSON is similar to JSON but supports additional data types such as:

* ObjectId
* Date
* Binary data
* Decimal128

This allows MongoDB documents to represent more data types than standard JSON.

---

# 19. MongoDB Installation

I installed and configured:

```text
MongoDB Community Server
MongoDB Shell (mongosh)
MongoDB Compass
MongoDB for VS Code
```

Installed MongoDB Server version:

```text
8.3.11
```

Installed MongoDB Shell version:

```text
2.11.1
```

---

# 20. MongoDB Windows Service

MongoDB was configured as a Windows service.

I verified the service using:

```powershell
Get-Service MongoDB
```

The result showed:

```text
Status   Name      DisplayName
Running  MongoDB   MongoDB Server (MongoDB)
```

Therefore, the MongoDB server was successfully running as a Windows service.

---

# 21. MongoDB PATH Configuration

Initially, Windows could not find:

```text
mongod
```

The MongoDB installation was located at:

```text
C:\Program Files\MongoDB\Server\8.3\bin
```

I added this directory to the Windows PATH environment variable.

After configuring PATH, the following command worked:

```powershell
mongod --version
```

and returned:

```text
db version v8.3.11
```

---

# 22. MongoDB Shell

`mongod` and `mongosh` have different purposes.

```text
mongod
```

is the MongoDB server process.

```text
mongosh
```

is the MongoDB Shell used to interact with the server.

The connection was established using:

```text
mongodb://127.0.0.1:27017
```

---

# 23. Local MongoDB Connection

The local MongoDB server uses:

```text
127.0.0.1:27017
```

Meaning:

```text
127.0.0.1
```

refers to the local computer.

```text
27017
```

is MongoDB's standard default port.

The connection architecture is:

```text
mongosh
   │
   ▼
127.0.0.1:27017
   │
   ▼
MongoDB Server
```

---

# 24. MongoDB Compass

MongoDB Compass is the graphical interface for MongoDB.

I connected Compass to:

```text
mongodb://127.0.0.1:27017
```

Compass allowed me to visually inspect:

```text
Databases
   ↓
bootcamp_db
   ↓
students
   ↓
Documents
```

---

# 25. MongoDB in VS Code

I installed the official:

```text
MongoDB for VS Code
```

extension.

I connected VS Code to:

```text
mongodb://127.0.0.1:27017
```

The VS Code MongoDB panel displayed databases including:

```text
admin
bootcamp_db
config
local
```

This confirmed that VS Code was connected to the same MongoDB server.

---

# 26. MongoDB CRUD

## Create

I inserted a document using:

```javascript
db.students.insertOne({
  name: "Kamal",
  age: 23,
  course: "Computer Engineering"
})
```

MongoDB returned:

```text
acknowledged: true
```

---

## Read

To retrieve all documents:

```javascript
db.students.find()
```

To find documents matching a condition:

```javascript
db.students.find({ name: "Kamal" })
```

To find one matching document:

```javascript
db.students.findOne({ name: "Kamal" })
```

---

## Update

I used:

```javascript
db.students.updateOne(
  { name: "Kamal" },
  { $set: { age: 24 } }
)
```

The `$set` operator changes the specified field without replacing the entire document.

---

## Delete

For delete practice, I created a temporary document and removed it using:

```javascript
db.students.deleteOne({
  name: "Test Student"
})
```

MongoDB returned a `deletedCount` indicating the document was deleted.

---

# 27. CRUD Summary

```text
CREATE
db.students.insertOne()

READ
db.students.find()
db.students.findOne()

UPDATE
db.students.updateOne()

DELETE
db.students.deleteOne()
```

---

# 28. Practical Database Structure Created Today

The final practice structure was:

```text
MongoDB Server
│
└── bootcamp_db
      │
      └── students
            │
            └── {
                  _id: ObjectId(...),
                  name: "Kamal",
                  age: 24,
                  course: "Computer Engineering"
                }
```

---

# 29. Key Commands Learned

### MongoDB Server

```powershell
mongod --version
```

### MongoDB Shell

```powershell
mongosh --version
```

```powershell
mongosh
```

### Database commands

```javascript
show dbs
```

```javascript
use bootcamp_db
```

```javascript
show collections
```

### Collection

```javascript
db.createCollection("students")
```

### Create

```javascript
db.students.insertOne({...})
```

### Read

```javascript
db.students.find()
```

```javascript
db.students.findOne({...})
```

### Update

```javascript
db.students.updateOne(
  {...},
  {$set: {...}}
)
```

### Delete

```javascript
db.students.deleteOne({...})
```

---

# 30. Key Takeaways

1. A database provides persistent and organized data storage.
2. SQL databases use a relational model based mainly on tables, rows, columns, keys, and relationships.
3. NoSQL databases use different non-relational models.
4. MongoDB is a document-oriented NoSQL database.
5. MongoDB uses databases, collections, documents, and fields.
6. MongoDB documents are stored using BSON.
7. MongoDB automatically generates `_id` values when one is not supplied.
8. MongoDB supports flexible document structures, including arrays and nested documents.
9. SQL and NoSQL should be selected according to application requirements.
10. ORM maps application objects to relational database structures.
11. Mongoose is commonly considered an ODM for MongoDB rather than an ORM.
12. `mongod` is the MongoDB server, while `mongosh` is the command-line client.
13. MongoDB Compass provides a graphical interface for MongoDB.
14. MongoDB for VS Code allows MongoDB to be accessed from the development environment.
15. Basic MongoDB CRUD operations are performed using `insertOne()`, `find()`, `updateOne()`, and `deleteOne()`.

---

# 31. Current Setup Status

```text
MongoDB Community Server       ✅
MongoDB Server 8.3.11          ✅
MongoDB Windows Service        ✅ Running
MongoDB Shell 2.11.1           ✅
MongoDB Compass                ✅
MongoDB for VS Code            ✅
Local MongoDB Connection       ✅
Database Created               ✅
Collection Created             ✅
CRUD Practiced                 ✅
```

---

# 32. Next Learning Topics

The next MongoDB topics to practice are:

* Query operators
* Comparison operators
* Logical operators
* Sorting
* Limiting results
* Projection
* Multiple documents
* Nested documents
* Arrays
* Indexes
* MongoDB with Node.js
* MongoDB with Express
* Application-level CRUD using MongoDB
* Connection configuration using environment variables
