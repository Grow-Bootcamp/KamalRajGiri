// src/repos/course.repo.ts
import { Course } from "../models/Course.js";

export class CourseRepository {
    async addCourse(Courses: object) {
        return await Course.create(Courses);
    }
    async getCourses(Courses: object) {
        return await Course.find(Courses);
    }

    async getCourseById(Id: string) {
        return await Course.findById(Id);
    }
}