use("bootcamp_db"); // Switch to the bootcamp_db database

print("MongoDB Day 2 Practice Started");

db.students_day2.drop(); // Drop the collection if it exists 

// Create a new collection for students with embedded address
db.students_day2.insertOne({ // Insert a student document with embedded address
  name: "Kamal",
  age: 23,
  email: "kamal@example.com",
// Embedded document for address
  address: {
    city: "Mahendranagar",
    country: "Nepal"
  }
});

print("Student with embedded address created");


// Insert another student document with embedded address
db.students_day2.insertOne({
  name: "Sita",
  age: 22,
  email: "sita@example.com",
  address: {
    city: "Kathmandu",
    country: "Nepal"
  }
});

print("Another student with embedded address created");

// Adding a course collection and referencing it in the student document
db.courses_day2.drop();

const courseResult = db.courses_day2.insertOne({
  name: "Computer Engineering",
  duration: 4,
  fee: Decimal128("500000.00")
});

const courseId = courseResult.insertedId;

db.students_day2.updateOne(
  { name: "Kamal" },
  {
    $set: {
      courseIds: [courseId] // Reference to the course document
    }
  }
);

print("Course created and referenced by student");


// Create a new collection with schema validation
db.students_validated_day2.drop();

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
  validationLevel: "strict", // Enforce strict validation
  validationAction: "error" // Reject documents that do not meet the schema requirements
});

print("Schema validation collection created");


db.students_validated_day2.insertOne({
  name: "Kamal",
  age: 23,
  email: "kamal@example.com",
  address: {
    city: "Mahendranagar",
    country: "Nepal"
  }
});

print("Valid student inserted");

try {
  db.students_validated_day2.insertOne({
    name: "Ram",
    age: "twenty-three",
    email: "ram@example.com"
  });
} catch (error) {
  print("Invalid student rejected by schema validation");
}

// Create a collection to demonstrate numeric BSON types
db.numeric_types_day2.drop();

db.numeric_types_day2.insertOne({
  age: NumberInt(23),
  population: NumberLong("3000000000"),
  marks: 85.5,
  fee: Decimal128("500000.00")
});

print("Numeric BSON types inserted");


const numericDocument = db.numeric_types_day2.findOne(); // Retrieve the document to check the types of numeric fields

print("Stored numeric types:");

print("age: " + typeof numericDocument.age);
print("population: " + typeof numericDocument.population);
print("marks: " + typeof numericDocument.marks);
print("fee: " + typeof numericDocument.fee);

db.numeric_types_day2.aggregate([ // Use aggregation to check the BSON types of the numeric fields
  {
    $project: {
      ageType: { $type: "$age" },
      populationType: { $type: "$population" },
      marksType: { $type: "$marks" },
      feeType: { $type: "$fee" }
    }
  }
]).forEach(printjson);


print("Data modelling verification:");

db.students_day2.find().forEach(printjson);
db.courses_day2.find().forEach(printjson);

print("MongoDB Day 2 Practice Completed");