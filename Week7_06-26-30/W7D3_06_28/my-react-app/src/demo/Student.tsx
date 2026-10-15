import "../App.css"

import type { Student } from "./types.student";

function Students() {
    const student: Student = {
        id: 1,
        name: "Aagyat",
        age: 23,
        city: "mnr",
        isEnrolled: true,
        courses: ["react", "node.js", "ml"]
    };


    return (
        <div>
            <h1>{student.name}</h1>
            <p>Current age: {student.age}</p>
            <p>Age next year: {student.age + 1}</p>
            <p>Status: {student.isEnrolled ? "Enrolled" : "Not Enrolled"}</p>
            <h2>Courses</h2>

            <ul className="ul">
                {student.courses.map((course) => (
                    <li key={course}>{course}</li>
                ))}
            </ul>
        </div>
    );
}

export default Students;