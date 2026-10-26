import { StudentRepository } from "../repos/student.repo.js";
const studentRepo = new StudentRepository();
export class StudentService {
    async newStudent(data) {
        return await studentRepo.addStudent(data);
    }
    async getAllStudents() {
        return await studentRepo.getStudents({});
    }
    async getAStudent(id) {
        return await studentRepo.getStudentById(id);
    }
    async getAllStudentsWithCourse() {
        return await studentRepo.getStudentsWithCourse({});
    }
    async getAStudentWithCourse(id) {
        return await studentRepo.getStudentWithCourseById(id);
    }
}
//# sourceMappingURL=student.service.js.map