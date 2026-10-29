# Sequelize + MySQL + TypeScript Setup

## 1. Initialize Project

```bash
npm init -y
```

## 2. Install Dependencies

```bash
npm install sequelize mysql2 dotenv
```

```bash
npm install -D typescript tsx @types/node sequelize-cli
```

## 3. Initialize TypeScript

```bash
npx tsc --init
```

## 4. Verify Sequelize CLI

```bash
npx sequelize-cli --version
```

## 5. Initialize Sequelize

```bash
npx sequelize-cli init
```

## 6. Create MySQL Database

```sql
CREATE DATABASE sequelize_demo;

USE sequelize_demo;
```

## 7. Generate Migration

```bash
npx sequelize-cli migration:generate --name create-students
```

## 8. Run Migration

```bash
npx sequelize-cli db:migrate
```

## 9. Check Migration Status

```bash
npx sequelize-cli db:migrate:status
```

## 10. Undo Latest Migration

```bash
npx sequelize-cli db:migrate:undo
```

## 11. Generate Seeder

```bash
npx sequelize-cli seed:generate --name demo-students
```

## 12. Run Seeders

```bash
npx sequelize-cli db:seed:all
```

## 13. Undo Latest Seeder

```bash
npx sequelize-cli db:seed:undo
```

## 14. Undo All Seeders

```bash
npx sequelize-cli db:seed:undo:all
```

## 15. Verify Database

```sql
USE sequelize_demo;

SHOW TABLES;

DESCRIBE students;

SELECT * FROM students;
```

## 16. Environment Variables

Create `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sequelize_demo
DB_USER=root
DB_PASSWORD=your_password
```

Add to `.gitignore`:

```gitignore
node_modules/
.env
```
