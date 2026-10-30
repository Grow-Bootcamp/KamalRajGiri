import type { Student } from "./types.student";

type StudentCardProps = {
  student: Student;
  onRemove: (studentId: number) => void;
};

function StudentCard({ student, onRemove }: StudentCardProps) {
  return (
    <article className="student-card">
      <h3>{student.name}</h3>

      <p>Age: {student.age}</p>
      <p>City: {student.city ?? "Unknown"}</p>

      <p>
        Status: {student.isEnrolled ? "Enrolled" : "Not enrolled"}
      </p>

      <p>Courses: {student.courses.join(", ") || "No courses"}</p>

      <button type="button" onClick={() => onRemove(student.id)}>
        Remove
      </button>
    </article>
  );
}

export default StudentCard;