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
let userId: ID = 123; // valid
userId = "abc"; // also valid
// userId = true; // Error: Type 'boolean' is not assignable to type 'ID'.

type Name = string;
let userName: Name = "John"; // valid
// userName = 123; // Error: Type 'number' is not assignable to type 'Name'.

// Union types
type Status = "pending" | "approved" | "rejected";

let currentStatus: Status = "pending"; // valid
// currentStatus = "in-progress"; // Error: Type '"in-progress"' is not assignable to type 'Status'.
type StringOrNumber = string | number;


// Narrowing down the type of a variable
function printId(id: string | number): void {
    if(typeof id === "string"){
        console.log(id.toUpperCase());
    }else{
        console.log(id.toFixed(0));
    }
}
printId("abc"); // Output: ABC
printId(123); // Output: 123
// printId(true); // Error: Argument of type 'boolean' is not assignable to parameter of type 'string | number'.
printId("12A"); // Output: 12A


// Intersection types
type Person = { name: string };
type Employee = { employeeId: number };
type Staff = Person & Employee;
const staff: Staff = { name: "John", employeeId: 12345 };
console.table(staff); // Output: { name: 'John', employeeId: 12345 }
// const staff1: Staff = { name: "Alice" }; // Error: Property 'employeeId' is missing in type '{ name: string; }' but required in type 'Staff'.


function greet(name: string, message: string = "Hello"): void {
    console.log(`${message}, ${name}!`);
}

greet("Alice"); // Output: Hello, Alice!
greet("Bob", "Hi"); // Output: Hi, Bob!

// Tuple
type Point = [number, number];
const point: Point = [10, 20];
console.table(point); // Output: [10, 20]
// const point1: Point = [30]; // Error: Source has 1 element(s) but target requires 2.


// Function type

type MathOperation = (a: number, b: number) => number;

const add = (a: number, b: number): number => a + b;
const subtract: MathOperation = (a, b) => a - b;


// Complex combinations
type Result<T> = { success: true; data: T } | { success: false; error: string };

//Problem 
// function getFirst(items: number[]): number {
//     return items[0];
// }
// function getFirstString(items: string[]): string {
//     return items[0];
// }

// same function can be used for different types of arrays using generics.


//Generic Solution

function getFirst<T>(items: T[]): T {
    return items[0];
}
const number = getFirst<number>([10, 20, 30]);
const string = getFirst<string>(["Alice", "Bob", "Charlie"]);
console.log(number); // Output: 10
console.log(string); // Output: Alice