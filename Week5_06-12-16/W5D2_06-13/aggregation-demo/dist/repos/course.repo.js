import Course from "../models/course.model.js";
class CourseRepository {
    async getAllCourses() {
        return Course.find();
    }
    async getCoursesWithStudents() {
        return Course.find().populate("students");
    }
    async getCourseById(id) {
        return Course.findById(id);
    }
}
export default new CourseRepository();
//# sourceMappingURL=course.repo.js.map