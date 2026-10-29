import mongoose from 'mongoose';
import { connectDatabase } from './config/db.js';
import {Course} from './models/Course.js'
import { Student } from './models/Student.js';
import { StudentService} from './services/student.service.js';

const testPopulate = async (): Promise<void> => {
    try {
        // Connect to mongodb
        await connectDatabase();

        // Create one Course

        const course =await Course.create({
                name:"Mathematics", 
                code: "MA01", 
                duration: 4
            });
        console.log("Course Created: ", course);

        // Create a Student 
        
        const student = await Student.create({
                name:"Aagyat", 
                age:23, 
                email:'aagyat@eg.com', 
                course:course._id 
            });
        console.log("Student Created : ", student);

        // Create StudentService
        const studentService = new StudentService();

        //Get Student with populated course
        const students = await studentService.getAllStudentsWithCourse();

        //Display Result
        console.log("Students with Course: ");
        // console.dir(students, {depth: null});
        console.dir(students);
        
    } catch (error){
        console.error("Error:",error);
    } finally {
        // Close MongoDB Connection
        await mongoose.disconnect();
        console.log("MongoDB disconected");
    }
};

testPopulate();