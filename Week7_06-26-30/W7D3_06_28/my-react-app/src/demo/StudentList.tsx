import StudentCard from "./StudentCard";
import type { Student } from "./types.student";

type StudentListProps = {
  students: Student[];
  onRemove: (studentId: number) => void;
};

function StudentList({ students, onRemove }: StudentListProps) {
  return (
    <section>
      <h2>All Students</h2>

      {students.length === 0 ? (
        <p>No students remaining.</p>
      ) : (
        <div className="student-list">
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default StudentList;