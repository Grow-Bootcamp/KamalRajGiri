import Student from "../models/student.model.js";

class StudentRepository {
  async getFilteredStudents(filter: any) {
    return Student.find(filter);
  }

  async getSortedStudents(filter: any, sort: any) {
    return Student.find(filter).sort(sort);
  }

  async getPaginatedStudents(
    filter: any,
    skip: number,
    limit: number,
    sort: any
  ) {
    return Student.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async countStudents(filter: any) {
    return Student.countDocuments(filter);
  }

  async getStudentsWithCourses() {
    return Student.find().populate("courses");
  }

  async getStudentWithCourses(id: string) {
    return Student.findById(id).populate("courses");
  }

  async aggregateStudents(pipeline: any[]) {
    return Student.aggregate(pipeline);
  }
}

export default new StudentRepository();