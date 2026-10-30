import cron from "node-cron";
import { Student } from "../models/Student.js";
import "../models/Course.js";

cron.schedule("*/10 * * * * *", async () => {
    try {
        console.log(
            "🕐 Daily report job started:",
            new Date().toLocaleString()
        );

        const students = await Student.find().populate("course");

        console.log(`📊 Total students: ${students.length}`);

        students.forEach((student) => {
            console.log(
                `👨‍🎓 ${student.name} | Age: ${student.age} | Email: ${student.email}`
            );

            console.log("📚 Course:", student.course);
        });

        console.log("✅ Daily report job completed");
    } catch (error) {
        console.error("❌ Daily report job failed:", error);
    }
});