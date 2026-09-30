
import "dotenv/config";

import mongoose from "mongoose";

import { connectToDatabase } from "./config/db.js";
import Course from "./models/course.model.js";
import Student from "./models/student.model.js";

const seedDatabase = async (): Promise<void> => {
  try {
    // 1. Connect to MongoDB
    await connectToDatabase();

    // 2. Clear previous sample data
    await Student.deleteMany({});
    await Course.deleteMany({});

    // 3. Create courses
    await Course.insertMany([
      {
        name: "Computer Engineering",
        code: "CE101",
        department: "Engineering",
      },
      {
        name: "Computer Science",
        code: "CS101",
        department: "Computing",
      },
      {
        name: "Information Technology",
        code: "IT101",
        department: "Computing",
      },
    ]);

    // 4. Retrieve the actual Course documents
    const computerEngineering = await Course.findOne({
      code: "CE101",
    });

    const computerScience = await Course.findOne({
      code: "CS101",
    });

    const informationTechnology = await Course.findOne({
      code: "IT101",
    });

    // 5. Ensure all required courses exist
    if (
      !computerEngineering ||
      !computerScience ||
      !informationTechnology
    ) {
      throw new Error("One or more courses could not be found.");
    }

    // 6. Create students using actual Course ObjectIds
    await Student.insertMany([
      {
        name: "Kamal Raj Giri",
        age: 23,
        semester: 7,
        email: "kamal@example.com",
        courses: [
          computerEngineering._id,
          informationTechnology._id,
        ],
      },
      {
        name: "Sita Sharma",
        age: 21,
        semester: 5,
        email: "sita@example.com",
        courses: [computerScience._id],
      },
      {
        name: "Hari Thapa",
        age: 22,
        semester: 7,
        email: "hari@example.com",
        courses: [
          computerEngineering._id,
          computerScience._id,
        ],
      },
      {
        name: "Mina Joshi",
        age: 20,
        semester: 3,
        email: "mina@example.com",
        courses: [informationTechnology._id],
      },
      {
        name: "Ravi Bhandari",
        age: 24,
        semester: 8,
        email: "ravi@example.com",
        courses: [computerEngineering._id],
      },
      {
        name: "Anu Rawal",
        age: 21,
        semester: 5,
        email: "anu@example.com",
        courses: [
          computerScience._id,
          informationTechnology._id,
        ],
      },
    ]);

    console.log("Database seeded successfully.");

    console.log(
      "Courses created:",
      await Course.countDocuments()
    );

    console.log(
      "Students created:",
      await Student.countDocuments()
    );
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

await seedDatabase();