import studentRepository from "../repos/student.repo.js";

class StudentService {
  async getStudents(filter: any) {
    return studentRepository.getFilteredStudents(filter);
  }

  async getSortedStudents(filter: any, sort: any) {
    return studentRepository.getSortedStudents(filter, sort);
  }

  async getPaginatedStudents(
    filter: any,
    page: number,
    limit: number,
    sort: any
  ) {
    if (page < 1) {
      throw new Error("Page must be greater than 0");
    }

    if (limit < 1) {
      throw new Error("Limit must be greater than 0");
    }

    const skip = (page - 1) * limit;

    const students =
      await studentRepository.getPaginatedStudents(
        filter,
        skip,
        limit,
        sort
      );

    const total =
      await studentRepository.countStudents(filter);

    const totalPages = Math.ceil(total / limit);

    return {
      students,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        skip,
      },
    };
  }

  async getStudentsWithCourses() {
    return studentRepository.getStudentsWithCourses();
  }

  async getStudentWithCourses(id: string) {
    return studentRepository.getStudentWithCourses(id);
  }

  async aggregateStudents(pipeline: any[]) {
    return studentRepository.aggregateStudents(pipeline);
  }
}

export default new StudentService();