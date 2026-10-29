import { StudentRepository } from "../repos/student.repo.js";

const studentRepo = new StudentRepository();

export class StudentService{
    async newStudent(data: object){
        return await studentRepo.addStudent(data); 
    }
    
    async getAllStudents(){
        return await studentRepo.getStudents({});
    }

    async getAStudent(id: string){
        return await studentRepo.getStudentById(id);
    }
    async getAllStudentsWithCourse(){
        return await studentRepo.getStudentsWithCourse({});
    }

    async getAStudentWithCourse(id: string){
        return await studentRepo.getStudentWithCourseById(id);
    }

}