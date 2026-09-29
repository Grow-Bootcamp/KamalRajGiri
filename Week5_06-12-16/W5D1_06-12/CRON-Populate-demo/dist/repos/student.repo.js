// src/repos/student.repo.ts
import { Student } from "../models/Student.js";
export class StudentRepository {
    async addStudent(students) {
        return await Student.create(students);
    }
    async getStudents(Students) {
        return await Student.find(Students);
    }
    async getStudentById(Id) {
        return await Student.findById(Id);
    }
    async getStudentsWithCourse(Students) {
        return await Student.find(Students).populate("course");
    }
    async getStudentWithCourseById(Id) {
        return await Student.findById(Id).populate("course");
    }
}
//# sourceMappingURL=student.repo.js.map