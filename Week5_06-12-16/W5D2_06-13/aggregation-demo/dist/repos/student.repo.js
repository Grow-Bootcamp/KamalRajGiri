import Student from "../models/student.model.js";
class StudentRepository {
    async getFilteredStudents(filter) {
        return Student.find(filter);
    }
    async getSortedStudents(filter, sort) {
        return Student.find(filter).sort(sort);
    }
    async getPaginatedStudents(filter, skip, limit, sort) {
        return Student.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
    }
    async countStudents(filter) {
        return Student.countDocuments(filter);
    }
    async getStudentsWithCourses() {
        return Student.find().populate("courses");
    }
    async getStudentWithCourses(id) {
        return Student.findById(id).populate("courses");
    }
    async aggregateStudents(pipeline) {
        return Student.aggregate(pipeline);
    }
}
export default new StudentRepository();
//# sourceMappingURL=student.repo.js.map