# Week 5: Day 3 — MySQL with an ORM (Sequelize)
**Date:** 6 October 2026
---

## 1. Objective

The objective of this session was to learn how to interact with MySQL using Sequelize ORM. The session focused on setting up Sequelize with MySQL, defining models and validation rules, performing CRUD operations, and managing database structure and sample data using migrations and seeders.

---

## 2. Topics Covered

* ORM and Sequelize fundamentals
* Sequelize and MySQL setup
* Database connection using Sequelize
* Environment variable configuration
* Sequelize model and schema definition
* Model-level validation
* CRUD operations
* Sequelize CLI
* Database migrations
* Migration rollback
* Seeders
* Seeder rollback
* `sequelize.sync()` vs migrations
* Model vs Service vs Migration vs Seeder
* Logical and conceptual understanding of Sequelize

---

# 3. ORM and Sequelize

## What is ORM?

ORM stands for **Object-Relational Mapping**.

An ORM provides a programming interface between an application and a relational database. It maps application objects/models to database tables.

Basic flow:

```text
TypeScript Application
        ↓
     Sequelize
        ↓
    Generated SQL
        ↓
       MySQL
```

Sequelize is an ORM for Node.js applications that can be used with relational databases such as MySQL.

## Why use an ORM?

An ORM allows developers to perform common database operations using programming-language objects and methods instead of manually writing SQL for every operation.

For example, instead of:

```sql
INSERT INTO students (name, email, age)
VALUES ('Kamal', 'kamal@gmail.com', 22);
```

Sequelize allows:

```ts
await Student.create({
  name: "Kamal",
  email: "kamal@gmail.com",
  age: 22,
});
```

Sequelize does not replace MySQL and does not eliminate SQL. It provides an abstraction layer and generates/executes SQL internally.

---

# 4. Project Setup

## Packages Installed

```bash
npm install sequelize mysql2 dotenv
```

Development dependencies:

```bash
npm install --save-dev sequelize-cli typescript tsx @types/node
```

Initialize TypeScript:

```bash
npx tsc --init
```

Initialize Sequelize CLI:

```bash
npx sequelize-cli init
```

---

# 5. MySQL Database Setup

A database was created for the Sequelize practice:

```sql
CREATE DATABASE sequelize_demo;
```

The database was then selected:

```sql
USE sequelize_demo;
```

The application uses MySQL as the database and Sequelize as the ORM.

---

# 6. Environment Configuration

A `.env` file was used to store database configuration:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sequelize_demo
DB_USER=root
DB_PASSWORD=your_password
```

The `.env` file should not be committed to Git because it can contain sensitive credentials.

`.gitignore`:

```gitignore
node_modules/
.env
```

---

# 7. Sequelize Database Connection

The Sequelize instance was configured in:

```text
src/config/database.ts
```

Example:

```ts
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    logging: console.log,
  }
);
```

The connection was tested using:

```ts
await sequelize.authenticate();
```

`authenticate()` checks whether Sequelize can successfully communicate with the configured database.

---

# 8. Sequelize Model

A `Student` model was created to represent the `students` table.

File:

```text
src/models/student.model.ts
```

Example:

```ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Student extends Model {}

Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty",
        },
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Invalid email address",
        },
      },
    },

    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [16],
          msg: "Age must be at least 16",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Student",
    tableName: "students",
    timestamps: true,
  }
);

export default Student;
```

---

# 9. Model Attributes and Constraints

## Primary Key

```ts
id: {
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true,
}
```

This represents an integer primary key that automatically generates IDs.

Conceptually:

```sql
id INT PRIMARY KEY AUTO_INCREMENT
```

## `allowNull`

```ts
allowNull: false
```

means the field cannot contain SQL `NULL`.

It does not mean that an empty string is automatically invalid.

## `notEmpty`

```ts
notEmpty: {
  msg: "Name cannot be empty",
}
```

checks that a string is not empty.

Therefore:

```text
NULL   → handled by allowNull
""     → handled by notEmpty
```

## `unique`

```ts
unique: true
```

ensures duplicate values are not allowed when the corresponding database uniqueness constraint is established.

For example:

```text
kamal@gmail.com → valid
kamal@gmail.com → duplicate
```

---

# 10. Model-Level Validation

Sequelize provides validation rules that are applied before the database operation is successfully completed.

Examples used:

```ts
validate: {
  isEmail: true
}
```

and:

```ts
validate: {
  notEmpty: true
}
```

and:

```ts
validate: {
  min: {
    args: [16],
  },
}
```

### Why use validation?

Validation allows invalid data to be rejected at the application/ORM level before it reaches the database.

Example:

```ts
await Student.create({
  name: "Test",
  email: "invalid-email",
  age: 15,
});
```

This should fail because:

```text
email → invalid email format
age   → below minimum value
```

### Validation vs Database Constraints

They are complementary.

```text
Application
     ↓
Sequelize Validation
     ↓
Database Constraints
     ↓
MySQL
```

Validation provides early application-level feedback, while database constraints protect data integrity at the database level.

---

# 11. CRUD Operations

CRUD means:

```text
C → Create
R → Read
U → Update
D → Delete
```

## Create

```ts
const student = await Student.create({
  name: "Kamal",
  email: "kamal@gmail.com",
  age: 22,
});
```

Conceptually equivalent to:

```sql
INSERT INTO students (name, email, age)
VALUES ('Kamal', 'kamal@gmail.com', 22);
```

---

## Read All

```ts
const students = await Student.findAll();
```

Conceptually:

```sql
SELECT * FROM students;
```

---

## Read One

```ts
const student = await Student.findOne({
  where: {
    email: "kamal@gmail.com",
  },
});
```

Conceptually:

```sql
SELECT *
FROM students
WHERE email = 'kamal@gmail.com'
LIMIT 1;
```

If no record is found, `findOne()` normally returns `null`.

---

## Find by Primary Key

```ts
const student = await Student.findByPk(1);
```

Conceptually:

```sql
SELECT *
FROM students
WHERE id = 1;
```

---

## Update

```ts
await Student.update(
  {
    age: 23,
  },
  {
    where: {
      email: "kamal@gmail.com",
    },
  }
);
```

Conceptually:

```sql
UPDATE students
SET age = 23
WHERE email = 'kamal@gmail.com';
```

### Important

The `where` condition is important.

Without an appropriate condition, an update can affect many or all records.

---

## Delete

```ts
await Student.destroy({
  where: {
    email: "kamal@gmail.com",
  },
});
```

Conceptually:

```sql
DELETE FROM students
WHERE email = 'kamal@gmail.com';
```

Again, an appropriate condition is important because an unintended delete can remove many or all records.

---

# 12. CRUD Mapping

| Sequelize            | SQL Equivalent                 |
| -------------------- | ------------------------------ |
| `Student.create()`   | `INSERT`                       |
| `Student.findAll()`  | `SELECT`                       |
| `Student.findOne()`  | `SELECT ... LIMIT 1`           |
| `Student.findByPk()` | `SELECT ... WHERE primary key` |
| `Student.update()`   | `UPDATE`                       |
| `Student.destroy()`  | `DELETE`                       |

The basic flow is:

```text
Sequelize Method
       ↓
Generated SQL
       ↓
MySQL
       ↓
Database Result
```

---

# 13. Sequelize CLI

Sequelize CLI was installed to manage migrations and seeders.

```bash
npm install --save-dev sequelize-cli
```

Initialization:

```bash
npx sequelize-cli init
```

This creates directories such as:

```text
config/
migrations/
models/
seeders/
```

---

# 14. Migrations

A migration is a version-controlled description of a database schema change.

Migrations can be used to:

* Create tables
* Add columns
* Remove columns
* Modify columns
* Add constraints
* Remove constraints
* Drop tables

A migration normally contains:

```js
module.exports = {
  async up(queryInterface, Sequelize) {
    // Apply change
  },

  async down(queryInterface, Sequelize) {
    // Reverse change
  },
};
```

## `up()`

`up()` applies the database change.

Example:

```js
await queryInterface.createTable("students", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },

  age: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },

  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});
```

## `down()`

`down()` reverses the migration.

```js
await queryInterface.dropTable("students");
```

---

# 15. Creating and Running a Migration

Generate migration:

```bash
npx sequelize-cli migration:generate --name create-students
```

Run migrations:

```bash
npx sequelize-cli db:migrate
```

Check migration status:

```bash
npx sequelize-cli db:migrate:status
```

Undo the latest migration:

```bash
npx sequelize-cli db:migrate:undo
```

---

# 16. SequelizeMeta

Sequelize maintains a table named:

```text
SequelizeMeta
```

This table keeps track of migrations that have already been executed.

Conceptually:

```text
Migration Files
      ↓
SequelizeMeta
      ↓
Which migrations have already run?
```

If a migration has already been executed, running:

```bash
npx sequelize-cli db:migrate
```

again does not normally execute the same migration again.

---

# 17. Seeders

A seeder is used to insert predefined or sample data into a database.

Seeders are useful for:

* Development
* Testing
* Demonstrations
* Initial/reference data

Generate a seeder:

```bash
npx sequelize-cli seed:generate --name demo-students
```

Example:

```js
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("students", [
      {
        name: "Kamal",
        email: "kamal@gmail.com",
        age: 22,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Aagyat",
        email: "aagyat@gmail.com",
        age: 21,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Anjana",
        email: "anjana@gmail.com",
        age: 22,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("students", null, {});
  },
};
```

Run all seeders:

```bash
npx sequelize-cli db:seed:all
```

Undo the latest seeder:

```bash
npx sequelize-cli db:seed:undo
```

Undo all seeders:

```bash
npx sequelize-cli db:seed:undo:all
```

---

# 18. Migration vs Seeder

The main difference is:

```text
Migration → Database structure
Seeder    → Database data
```

Example:

```text
Migration
    ↓
CREATE students table

Seeder
    ↓
INSERT Kamal
INSERT Aagyat
INSERT Anjana
```

---

# 19. Model vs Migration vs Seeder vs Service

| Component | Responsibility                                  |
| --------- | ----------------------------------------------- |
| Model     | Application representation of a database entity |
| Service   | Application/business logic                      |
| Migration | Version-controlled database structure changes   |
| Seeder    | Predefined/sample data                          |

A useful way to remember:

```text
Service:
"What should the application do?"

Model:
"What does this data entity look like?"

Migration:
"How should the database structure change?"

Seeder:
"What predefined data should be inserted?"
```

---

# 20. `sequelize.sync()` vs Migrations

`sequelize.sync()` can synchronize Sequelize models with database tables.

Example:

```ts
await sequelize.sync();
```

This can automatically create missing tables based on model definitions.

However, migrations provide explicit and version-controlled database schema changes.

| Feature           | `sequelize.sync()`            | Migration                     |
| ----------------- | ----------------------------- | ----------------------------- |
| Main purpose      | Synchronize model/table       | Manage schema changes         |
| Best use          | Development/prototyping       | Controlled database evolution |
| Versioned history | No explicit migration history | Yes                           |
| `up()` / `down()` | No                            | Yes                           |
| Rollback workflow | Not equivalent to migrations  | Supported                     |

### Important conclusion

The model and migration are related but not the same.

```text
Model
→ Describes the application's representation of the data.

Migration
→ Records how the actual database structure changes over time.
```

---

# 21. Logical and Conceptual Questions

## Why use Sequelize if SQL already exists?

SQL is still used internally, but Sequelize provides an application-level abstraction that simplifies common database operations and integrates database access with application models.

## Does Sequelize replace MySQL?

No.

MySQL is the database. Sequelize is the ORM used by the application to communicate with it.

## Does Sequelize eliminate SQL?

No. Sequelize generates or executes SQL internally.

## Why validate if MySQL has constraints?

Sequelize validation provides early application-level feedback, while database constraints provide database-level data integrity.

## What if validation is removed?

Invalid data may reach the database unless another application rule or database constraint rejects it.

## What if `findOne()` finds nothing?

It normally returns `null`, so the application should handle that case.

## What if `update()` is used without a proper `where` condition?

It may update many or all rows, causing unintended data modification.

## What if `destroy()` is used without a proper condition?

It may delete many or all rows.

## Why do we need migrations if the model already defines the schema?

The model describes the application's current representation of the data. Migrations provide a controlled and versioned history of changes to the actual database structure.

## Why do we need seeders?

They automate insertion of predefined or sample data instead of requiring manual database insertion.

## What if we run the same migration twice?

Sequelize tracks executed migrations using `SequelizeMeta`, so already-applied migrations are normally not executed again.

## What if MySQL is unavailable?

The Sequelize database operation cannot complete successfully. The application should handle the connection or query error.

## What if the database exists but the table does not?

The connection can succeed because the database is available, but a CRUD operation against a missing table can fail.

## What if we do not use Sequelize?

The application can communicate directly with MySQL using a driver such as `mysql2` and raw SQL.

## What if we do not use migrations?

Tables can still be created manually or through other mechanisms such as `sync()`, but there is no clean migration-based history of database schema changes.

## What if we do not use seeders?

The application can still work. Data would need to be inserted manually or through another mechanism.

---

# 22. Key Cross-Question Concepts

### ORM

```text
Object ↔ Relational Database
```

### Model

```text
Application representation of database entity
```

### Migration

```text
Version-controlled database structure change
```

### Seeder

```text
Predefined/sample database data
```

### Service

```text
Application/business logic
```

### CRUD

```text
Create → INSERT
Read   → SELECT
Update → UPDATE
Delete → DELETE
```

### Validation

```text
Check application input before database operation
```

### `sync()`

```text
Synchronize model definitions with database tables
```

---

# 23. Important Commands Summary

```bash
# Install Sequelize
npm install sequelize mysql2 dotenv

# Install development dependencies
npm install --save-dev sequelize-cli typescript tsx @types/node

# Initialize Sequelize CLI
npx sequelize-cli init

# Generate migration
npx sequelize-cli migration:generate --name create-students

# Run migration
npx sequelize-cli db:migrate

# Check migration status
npx sequelize-cli db:migrate:status

# Undo latest migration
npx sequelize-cli db:migrate:undo

# Generate seeder
npx sequelize-cli seed:generate --name demo-students

# Run seeders
npx sequelize-cli db:seed:all

# Undo latest seeder
npx sequelize-cli db:seed:undo

# Undo all seeders
npx sequelize-cli db:seed:undo:all
```

---

# 24. Git Submission

After verifying the project:

```bash
git status
```

Stage the work:

```bash
git add .
```

Commit:

```bash
git commit -m "feat: add Sequelize MySQL CRUD migrations and seeders"
```

Push the branch:

```bash
git push origin <your-branch>
```

Then create the GitHub Pull Request and send the PR to the mentor for review.

The learning-log link and PR link should then be posted in:

* Zoho task comment
* Microsoft Teams corresponding comment/thread

---

# 25. Acceptance Criteria

| Acceptance Criteria                                             | Status                            |
| --------------------------------------------------------------- | --------------------------------- |
| Perform CRUD operations on a MySQL table using Sequelize models | Completed                         |
| Define model-level validation rules                             | Completed                         |
| Create and run a migration successfully                         | Completed                         |
| Create and run a seeder successfully                            | Completed                         |
| Create/update daily learning log                                | Completed                         |
| Commit the learning log and practice code                       |  completed during submission |
| Raise GitHub Pull Request                                       | completed during submission |
| Share learning-log and PR links in Zoho                         | completed                   |
| Share learning-log and PR links in Microsoft Teams              | completed                   |

---

# 26. Key Learnings

1. Sequelize is an ORM that provides an abstraction between a TypeScript/Node.js application and MySQL.

2. Sequelize does not replace MySQL and does not eliminate SQL.

3. A Sequelize model represents a database entity/table in the application.

4. Model attributes can define datatypes, constraints, and validation rules.

5. Sequelize provides methods such as `create()`, `findAll()`, `findOne()`, `findByPk()`, `update()`, and `destroy()` for CRUD operations.

6. Model-level validation provides early application-level input checking.

7. Database constraints should still be used to protect database integrity.

8. Migrations provide version-controlled and reversible database schema changes.

9. Seeders provide automated insertion of predefined/sample data.

10. `sequelize.sync()` is useful for development/prototyping, while migrations provide explicit and controlled schema evolution.

11. Services, models, migrations, and seeders have different responsibilities and should not be treated as interchangeable components.

12. Conditions in update and delete operations are important to prevent unintended modification or deletion of multiple records.

---

# 27. Conclusion

This session provided practical and conceptual understanding of using Sequelize ORM with MySQL. A Sequelize database connection was configured using environment variables, a Student model was created with schema attributes and validation rules, and CRUD operations were performed through Sequelize methods.

Database migrations were introduced to manage schema changes in a controlled and versioned manner, including migration execution and rollback. Seeders were used to automate the insertion of predefined student data.

The session also clarified the difference between Sequelize models, services, migrations, and seeders, as well as the difference between `sequelize.sync()` and migration-based schema management.

The completed work satisfies the main technical learning objectives for Week 5 Day 3 and prepares the project for Git commit, Pull Request submission, and mentor review.
