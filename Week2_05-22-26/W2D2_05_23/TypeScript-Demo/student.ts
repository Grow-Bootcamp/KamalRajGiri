enum Role {
    Student = "student",
    Teacher = "teacher",
    Admin = "admin"
}

interface Student{
    id : number;
    name: string;
    age : number;
    email?: string;
    marks : number[];
    role :Role;
    status : "active" | "inactive";
    readonly createdAt : Date;
}

const student1 : Student = {
    id : 1,
    name : "Kamal",
    age : 25,
    email : "kamal@example.com",
    marks : [80, 75, 90],
    role : Role.Student,
    status : "active",
    createdAt : new Date()
}

const student2 : Student = {
    id : 2,
    name : "Alice", 
    age : 22,
    marks : [90, 85, 88],
    role : Role.Student,
    status : "inactive",
    createdAt : new Date()
}

const students: Student[] = [student1, student2];
console.table(students);

function  calcAvgMarks(marks: number[]): number {
    const total = marks.reduce((acc, mark) => acc + mark, 0);
    return total / marks.length;
}
console.log(calcAvgMarks(student1.marks)); 
console.log(calcAvgMarks(student2.marks)); 

type ReportFunction =(student: Student) => string;

const generateReport: ReportFunction = (student) => {
    switch(student.status) {
        case "active":
            return `${student.name} is an active student with average marks of ${calcAvgMarks(student.marks)}`;
        case "inactive":
            return `${student.name} is an inactive student.`;
        default:
            return `Unknown student status.`;
    }
}

function getFirst<T>(items: T[]): T {
    return items[0];
}
const firstStudent = getFirst(students);
const firstMark = getFirst(student1.marks);
const firstName = getFirst(["Kamal", "Alice"]);

console.log(firstStudent);
console.log(firstMark);
console.log(firstName);

type PersonInfo ={
    name: string;
    age: number;
    email?: string;
}

type TeacherInfo = {
    subject: string;
    experience: number;
};

type Teacher = PersonInfo & TeacherInfo;

const teacher: Teacher = {
    name: "Mr. Smith",
    age: 40,
    subject: "Mathematics",
    experience: 15, 
    email: "mr.smith@example.com"
}

console.table(teacher);