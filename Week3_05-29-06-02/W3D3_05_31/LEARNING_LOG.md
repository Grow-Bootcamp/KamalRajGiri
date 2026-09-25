# Week 3 Day 2: MongoDB Data Modeling — Learning Log
** 16th September 2026 **

## 1. Overview

Today I learned how to model data effectively in MongoDB. The main topics were embedding and referencing related data, schema validation, MongoDB data types, and numeric BSON types.

I also practiced these concepts using MongoDB Shell with the `bootcamp_db` database. I created student and course collections, stored embedded addresses, referenced a course from a student document, applied JSON Schema validation, and inserted values using different numeric BSON types.

---

## 2. MongoDB Data Modeling

Data modeling is the process of deciding how application data should be organized, stored, and related in a database.

A good MongoDB data model should consider:

* How data is accessed by the application.
* Which data belongs together.
* How frequently related data is read or updated.
* Whether a relationship is one-to-one, one-to-many, or many-to-many.
* Document size and MongoDB's document size limit.
* Whether related data should be embedded or stored separately.

MongoDB stores data as BSON documents. A document can contain nested objects and arrays, which makes it possible to represent related data inside the same document.

---

## 3. Embedding Related Data

Embedding means storing related data inside the parent document.

Example:

```javascript
{
  name: "Kamal",
  age: 23,
  email: "kamal@example.com",
  address: {
    city: "Mahendranagar",
    country: "Nepal"
  }
}
```

The address is embedded directly inside the student document.

### Advantages of Embedding

* Related data can be retrieved in one query.
* It is convenient when the embedded data belongs only to the parent document.
* It can improve read performance.
* The document structure is simple for closely related data.

### Limitations of Embedding

* Repeated data can increase storage requirements.
* Large or frequently changing embedded data can make updates inefficient.
* Unbounded arrays can cause documents to grow too large.
* The embedded data cannot be independently managed as easily as a separate document.

Embedding is a good choice when related data is small, read together, and has a one-to-one or small one-to-many relationship with the parent.

---

## 4. Referencing Related Data

Referencing means storing related data in a separate collection and saving its identifier in the parent document.

Example course document:

```javascript
{
  name: "Computer Engineering",
  duration: 4,
  fee: Decimal128("500000.00")
}
```

The course identifier can then be referenced from a student document:

```javascript
{
  name: "Kamal",
  courseIds: [courseId]
}
```

### Advantages of Referencing

* Related data can be managed independently.
* It avoids duplicating large or shared data.
* It is suitable when many documents refer to the same data.
* Frequently changing data can be updated in one place.

### Limitations of Referencing

* Reading related data may require additional queries or an aggregation with `$lookup`.
* Application logic is needed to load the referenced documents.
* Queries can be more complex than reading an embedded document.

### Embedding vs Referencing

| Situation | Suitable approach |
| --------- | ----------------- |
| Small data read together with the parent | Embedding |
| Shared data used by many documents | Referencing |
| Large or independently managed data | Referencing |
| One-to-one data that belongs to the parent | Embedding |
| Frequently changing related data | Referencing |

The choice should be based on the application's read and update patterns rather than only on the relationship type.

---

## 5. Schema Validation

MongoDB has a flexible schema by default, but flexibility does not mean that all documents should have arbitrary structures. Schema validation can enforce important data rules at the collection level.

Example:

```javascript
db.createCollection("students_validated_day2", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "age"],
      properties: {
        name: {
          bsonType: "string"
        },
        age: {
          bsonType: "int"
        },
        email: {
          bsonType: "string"
        },
        address: {
          bsonType: "object"
        },
        courseIds: {
          bsonType: "array"
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});
```

This validation rule requires every document to contain `name` and `age`. It also checks the BSON types of the defined fields.

A valid document can be inserted:

```javascript
db.students_validated_day2.insertOne({
  name: "Kamal",
  age: 23,
  email: "kamal@example.com"
});
```

An invalid document is rejected because `age` must be an integer:

```javascript
db.students_validated_day2.insertOne({
  name: "Ram",
  age: "twenty-three",
  email: "ram@example.com"
});
```

### Validation Options

* `validationLevel: "strict"` applies validation to all inserts and updates.
* `validationAction: "error"` rejects documents that do not satisfy the rules.
* `required` defines fields that must be present.
* `bsonType` defines the expected BSON data type.

Schema validation helps protect data quality while preserving MongoDB's document-oriented model.

---

## 6. MongoDB Data Types

MongoDB stores documents in BSON, which means Binary JSON. BSON supports JSON-like values and additional data types.

Common BSON types include:

| BSON type | Example |
| --------- | ------- |
| String | `"Kamal"` |
| Object | `{ city: "Kathmandu" }` |
| Array | `[courseId]` |
| Boolean | `true` |
| Date | `new Date()` |
| ObjectId | `ObjectId()` |
| Integer | `NumberInt(23)` |
| Long | `NumberLong("3000000000")` |
| Double | `85.5` |
| Decimal128 | `Decimal128("500000.00")` |
| Null | `null` |

Using the correct type is important for validation, comparisons, sorting, calculations, and storage accuracy.

---

## 7. Numeric BSON Types

Today I practiced four numeric representations:

```javascript
db.numeric_types_day2.insertOne({
  age: NumberInt(23),
  population: NumberLong("3000000000"),
  marks: 85.5,
  fee: Decimal128("500000.00")
});
```

### NumberInt

`NumberInt` stores a 32-bit signed integer. It is useful for whole numbers within the 32-bit integer range.

### NumberLong

`NumberLong` stores a 64-bit signed integer. It is useful for larger whole numbers, such as populations or counters that may exceed the 32-bit range.

### Double

A regular decimal JavaScript number is commonly stored as a BSON double. It is suitable for many general-purpose decimal values, but it can have floating-point precision limitations.

### Decimal128

`Decimal128` stores decimal values with high precision. It is appropriate for financial values such as fees, prices, and balances where exact decimal representation matters.

The `$type` aggregation expression can be used to inspect the BSON types stored in a document:

```javascript
db.numeric_types_day2.aggregate([
  {
    $project: {
      ageType: { $type: "$age" },
      populationType: { $type: "$population" },
      marksType: { $type: "$marks" },
      feeType: { $type: "$fee" }
    }
  }
]);
```

JavaScript's `typeof` operator only reports the JavaScript representation returned by the shell. MongoDB's `$type` expression is more useful for checking the actual BSON type stored in the database.

---

## 8. Practical Work Completed

The `mongodb-day2.js` practice script completed the following steps:

1. Selected the `bootcamp_db` database.
2. Created student documents with embedded address objects.
3. Created a course document with a `Decimal128` fee.
4. Referenced the course from a student using its inserted identifier.
5. Created a validated students collection using `$jsonSchema`.
6. Inserted a valid student document.
7. Confirmed that an invalid age value was rejected by validation.
8. Inserted and inspected multiple numeric BSON types.
9. Queried the student and course collections to verify the stored data.

---

## 9. Key Takeaways

* MongoDB data modeling should be driven by application access patterns.
* Embedding is useful for small related data that is usually read with its parent.
* Referencing is useful for shared, large, or independently changing data.
* MongoDB's flexible schema can be strengthened with collection-level validation.
* `required` and `bsonType` are useful for enforcing basic document structure and data types.
* BSON numeric types have different ranges and precision characteristics.
* `Decimal128` is preferable for monetary values that require exact decimal precision.
* MongoDB's `$type` expression should be used to inspect stored BSON types.

---

## 10. Reflection

Today I understood that MongoDB schema design is not simply about choosing between SQL tables and documents. The important decision is how the application will read, update, and relate data. Embedding can make common reads simple, while referencing avoids duplication and supports independently managed data. Schema validation and correct BSON types are also necessary to keep a flexible MongoDB database reliable.
