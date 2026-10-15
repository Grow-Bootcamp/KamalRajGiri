import { useState } from "react";
import "./App.css";

import Panel from "./demo/Panel";
import Students from "./demo/student";
import StudentCard from "./demo/StudentCard";
import StudentList from "./demo/StudentList";
import type { Student } from "./demo/types.student";
import Counter from "./demo/Counter";
import NameInput from "./demo/NameInput";
import DisplayFruits from "./demo/FruitPractice";
import FavoriteFruits from "./demo/FavouriteFruits";

const initialStudents: Student[] = [
  {
    id: 1,
    name: "Aagyat",
    age: 23,
    city: "Mnr",
    isEnrolled: true,
    courses: ["Math"],
  },
  {
    id: 2,
    name: "Ravi",
    age: 22,
    city: "Dhn",
    isEnrolled: true,
    courses: ["Math"],
  },
  {
    id: 3,
    name: "Anjana",
    age: 21,
    isEnrolled: false,
    courses: ["Math"],
  },
];

function App() {
  const [students, setStudents] = useState<Student[]>(initialStudents);

  function handleRemove(studentId: number) {
    setStudents((currentStudents) =>
      currentStudents.filter((student) => student.id !== studentId)
    );
  }

  const featuredStudent = students[0];

  return (
    <main>
      <h1>Namaste, Nepal 🙏</h1>
      <p>My first React application uses TypeScript.</p>

      {/* Original single-student learning example */}
      <Students />

      {/* One Panel with custom nested content */}
      <Panel title="Student Dashboard">
        <p>Welcome to the portal.</p>
        <p>View your courses and enrollment status.</p>
      </Panel>

      {/* Exactly one card: the first student */}
      <Panel title="Featured Student">
        {featuredStudent ? (
          <StudentCard
            student={featuredStudent}
            onRemove={handleRemove}
          />
        ) : (
          <p>No featured student available.</p>
        )}
      </Panel>

      {/* All students: one card per student */}
      <StudentList
        students={students}
        onRemove={handleRemove}
      />
      <Counter />
      <NameInput/>
      <DisplayFruits />

      <div className="ffruit">
        <FavoriteFruits/>
      </div>

    </main>
  );
}


export default App;