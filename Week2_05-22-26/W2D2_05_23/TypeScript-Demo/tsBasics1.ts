// interface : A way to define a contract for an object
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

const dog: Dog = { name: "Rex", breed: "Labrador" };
console.table(dog) // Output: { name: 'Rex', breed: 'Labrador' }


interface Student {
    name: string;
    age: number;
    marks: number[];
}
function printStudent(student: Student): void {
    console.log(student.name);
    console.log(student.age);
    console.log(student.marks);
}

const student: Student = {
    name: "Alice",
    age: 20,
    marks: [80, 75, 90]
};

printStudent(student);
//Use interface when describing the structure of objects, especially API/domain models.

// type alias : A way to create a new name for a type
type Stdent = {
    name: string;
    age: number;
    marks: number[];
};

const student1: Stdent = {
    name: "Kamal",
    age: 22,
    marks: [80, 75, 90]
};

const student2: Stdent = {
    name: "Alice",
    age: 20,
    marks: [90, 85, 88]
};

// The Student type doesn't create an object. It only describes what a Student should look like.
// Primitive aliases
type ID = number | string;
type Name = string;

// Union types
type Status = "pending" | "approved" | "rejected";
type StringOrNumber = string | number;

// Intersection types
type Person = { name: string };
type Employee = { employeeId: number };
type Staff = Person & Employee;

// Tuple
type Point = [number, number];

// Function type
type MathOperation = (a: number, b: number) => number;

// Complex combinations
type Result<T> = { success: true; data: T } | { success: false; error: string };

