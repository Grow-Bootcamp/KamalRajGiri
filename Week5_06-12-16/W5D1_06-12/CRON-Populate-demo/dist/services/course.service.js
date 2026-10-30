import { CourseRepository } from "../repos/course.repo.js";
const courseRepo = new CourseRepository();
export class CourseService {
    async newCourse(data) {
        return await courseRepo.addCourse(data);
    }
    async getAllCourses() {
        return await courseRepo.getCourses({});
    }
    async getACourse(id) {
        return await courseRepo.getCourseById(id);
    }
}
//# sourceMappingURL=course.service.js.map