// TypeScript Basics
// let variable_name : variable_type = value;

// Primitives 
let name : string = "Kamal";
let age : number = 25;
age = 26; // Reassigning age
// age = "27"; // This will cause a type error since age is of type number
let isStudent : boolean = true;
let nothing : null = null;
let notDefined : undefined = undefined;

// TypeScript can infer the type checking the value of assigning variable
let num = 22; 
let abc = "Hello";

// any and unknown types
// 'any' type can hold any value, but it's better to avoid using 'any' when possible
// 'unknown' type is safer than 'any' because it requires type checking before using the value
let anything : any = "I can be anything";
let anythingElse : unknown = "I can be anything too"; // 'unknown' type is safer than 'any' because it requires type checking before using the value
anything = 42; // Reassigning to a number
anythingElse = true; // Reassigning to a boolean


// Arrays
let marks: number[] = [85, 90, 78, 92];
marks.push(88); // Adding a new mark to the array
// marks.push("A"); // This will cause a type error since marks is an array of numbers

const skills : string[] = ["JavaScript", "TypeScript", "Node.js"];
const Fruits : Array<string> = ["Apple", "Banana", "Cherry"];  // Another way to define an array of strings
let arr : Array<number> = [1, 2, 3, 4, 5]; // Array of numbers 

// Tuple : A way to define an array with fixed number of elements and types
let person: [string, number] = ["Kamal", 25]; // Tuple with a string and a number
console.log(`Name: ${person[0]}, Age: ${person[1]}`);
console.log(person);



// Function with type annotations
function greet(person: string): string {
    return `Hello, ${person}!`;
}
console.log(greet(name));
console.log(Fruits);
console.log(skills);
console.log(marks);

function add (a:number, b:number): number {
    return a + b;
}
console.log(`Sum of 5 and 10 is: ${add(5, 10)}`);

// void type : A function that does not return a value
function logMessage(message: string): void {
    console.log(`Log: ${message}`);
}

logMessage("This is a test message.");


let obj : object ={
    name : "Kamal",
    age : 25,
    isStudent : true
};
console.log(obj);


let object :{
    name : string,
    age : number,
    isStudent : boolean
}; 
const student = {
    name : "Kamal",
    age : 25,
    isStudent : true
};

console.log(student);


// Interface : A way to define the shape of an object
interface Person {
    name: string;
    age: number;
    email?: string; // ? means optional property
    readonly createdAt: Date; // Readonly property : can't be modified after initialization
    greet(): string; // Method 
}

const person1: Person = {
    name: "Kamal",
    age: 25,
    email: "kamal@example.com",
    createdAt: new Date(),
    greet() {
        return `Hello, my name is ${this.name}`;
    }
};

console.log(person1.greet());
console.log(person1);


//Enum : A way to define a set of named constants.
// Enum example 
enum Role{
    Intern,
    Mentor,
    Admin
}

let myRole: Role = Role.Intern;
console.log(`My role is: ${Role[myRole]}`);