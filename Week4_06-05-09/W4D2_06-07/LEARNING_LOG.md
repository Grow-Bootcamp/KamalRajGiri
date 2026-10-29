# Learning Log - Week 4, Day 2: MongoDB with Mongoose

## Date
24 September, 2026

## Topics Covered
- Mongoose as an ODM for MongoDB
- Connecting to MongoDB using Mongoose
- Defining schemas and validation rules
- CRUD operations: Create, Read, Update, Delete
- Model-based database operations
- Use of `.env` for environment configuration

## Resources Reviewed
- `Mongoose-demo.js`
- `schema.js`
- `mongoose-/db.js`
- `mongoose-/models/Student.js`
- `mongoose-/server.js`
- `task`

## Key Learnings

### 1. Mongoose connection setup
Mongoose is used to connect Node.js applications to MongoDB. A database URI is required, and in the project it is stored through `process.env.MONGO_URI` loaded via `dotenv`.

```js
require('dotenv').config();

await mongoose.connect(process.env.MONGO_URI);
```

This makes configuration cleaner and safer, especially when working with local or deployment environments.

### 2. Schema design and validation
A schema tells Mongoose the expected structure of documents in a collection. In this project, the `Student` schema includes required fields and validation logic such as:

- `required: true`
- `trim: true`
- `minlength` / `maxlength`
- `min` / `max`
- `enum` for allowed values
- `unique: true` for emails
- `match` for email format validation

Example:

```js
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },

  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },

  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [16, 'Age cannot be less than 16'],
    max: [100, 'Age cannot exceed 100']
  }
});
```

These rules help prevent invalid or inconsistent data from being saved.

### 3. Mongoose model
Once a schema is created, a model is built to interact with a MongoDB collection.

```js
const Student = mongoose.model('Student', studentSchema);
```

A model acts like the main interface for performing database operations like `create()`, `find()`, `updateOne()`, and `deleteMany()`.

### 4. Create operations
The project demonstrates both instance-based creation and model-based creation:

```js
const student1 = new Student({
  name: 'Kamal Raj Giri',
  age: 23,
  email: 'kamal@example.com',
  course: 'Computer Engineering',
  semester: 7
});

await student1.save();
```

And:

```js
const student2 = await Student.create({
  name: 'Sita Sharma',
  age: 21,
  email: 'sita@example.com',
  course: 'Computer Engineering',
  semester: 7
});
```

`save()` creates a single document from a model instance, while `create()` does it in one step.

### 5. Read operations
Reading data is done using queries such as `find()`, `findOne()`, `findById()`, `countDocuments()`, and `select()`.

Examples:

```js
const students = await Student.find({ course: 'Computer Engineering' });
const student = await Student.findOne({ email: 'kamal@example.com' });
const foundById = await Student.findById('some_id');
const count = await Student.countDocuments({ course: 'Computer Engineering' });
```

Useful features used in the notes:
- Filtering with object conditions
- Selecting only specific fields
- Excluding fields
- Sorting
- Limiting results
- Pagination using `.skip()` and `.limit()`
- `.lean()` for plain JavaScript objects

### 6. Update operations
Mongoose supports updates with `findByIdAndUpdate()`, `updateOne()`, and `updateMany()`.

```js
const updated = await Student.findByIdAndUpdate(id, {
  $set: { semester: 8 }
}, {
  new: true,
  runValidators: true
});
```

Important notes:
- `new: true` returns the updated document
- `runValidators: true` ensures schema validation still runs during update
- `$set` is useful for updating only selected fields
- `$inc` can increment numeric fields

### 7. Delete operations
The project covers:

```js
await Student.findByIdAndDelete(id);
await Student.deleteOne({ name: 'delete' });
await Student.deleteMany({ course: 'BCA' });
```

This is important because broad filters like `{}` can delete everything, so delete operations must be used carefully.

## Practical Observations
- `unique: true` on email prevents duplicate records in the collection.
- Custom validation messages are more helpful than generic errors.
- `dotenv` should be loaded before accessing environment values.
- Query chaining like `.find().select().sort().limit()` is a powerful pattern for API development.
- Always validate updates when changing data, especially in production systems.

## Challenges and Notes
- Duplicate inserts can fail because of validation or unique field conflicts.
- Database errors such as duplicate key errors need to be checked carefully.
- Good schema design reduces bad data before it reaches the database.

## Summary
This session focused on how Mongoose connects Node.js apps to MongoDB and how schema-based models make data management easier. I learned that validation, query design, and controlled CRUD operations are essential for building reliable database-driven applications.

## Takeaways
- Mongoose simplifies MongoDB interaction by providing schema + model structure.
- Validation ensures data quality and catches bad inputs early.
- CRUD operations must be planned carefully with filters, validation, and error handling.
- Structured query patterns help with real-world application features like filtering, sorting, pagination, and performance.


