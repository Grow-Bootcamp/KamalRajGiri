// JS Data Types 

let number = 10; // let can be used when its value can be changed in future
const pi = 3.14; // const can be used when its value is constant and cannot be changed in future
var float = 3.14; // this var is not recommended to use in modern JS, We use let and const instead of var
let string = "Kamal";
let boolean = true;
let nullValue= null;
let UndefinedValue;
let symboolValue = Symbol();
let obj ={
    "name": "Kamal", "University": "FWU"
}
let arr = ["apple","banana", "mango"];

function add(a,b){
    return a+b;
}
console.log(typeof number);
console.log(typeof string);
console.log(typeof boolean);
console.log(typeof nullValue);
console.log(typeof UndefinedValue);
console.log(typeof symboolValue);
console.log(typeof obj);
console.log(typeof arr);
console.log(add(2,3));


let a = 10 + "20" + "ABC" + 20 + 30;
console.log(a);
let b = 10 + 20 + "ABC" + 20 + 30;
console.log(b);
console.log(typeof a);
console.log(typeof(3 + 5));
console.log(typeof(3 + "5"));
console.log(typeof(3 + 5 + "String"));

