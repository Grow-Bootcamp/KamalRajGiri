// src/repos/course.repo.ts
import { Course } from "../models/Course.js";
export class CourseRepository {
    async addCourse(Courses) {
        return await Course.create(Courses);
    }
    async getCourses(Courses) {
        return await Course.find(Courses);
    }
    async getCourseById(Id) {
        return await Course.findById(Id);
    }
}
//# sourceMappingURL=course.repo.js.map