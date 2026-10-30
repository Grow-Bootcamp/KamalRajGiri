// src/repos/student.repo.ts
import {Student} from "../models/Student.js";

export class StudentRepository{
    async addStudent(students: object){
        return await Student.create(students);
    }
    async getStudents(Students: object){
        return await Student.find(Students);
    }
    async getStudentById(Id: string){
        return await Student.findById(Id);
    }
    async getStudentsWithCourse(Students: object){
        return await Student.find(Students).populate("course");
    }
    async getStudentWithCourseById(Id: string){
        return await Student.findById(Id).populate("course");
    }
}