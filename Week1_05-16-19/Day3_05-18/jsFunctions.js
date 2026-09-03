// Javascript functions 
console.log("JavaScript Functions ");

function greet (){
    console.log("Namaste");
}
greet();

function add (a,b){
   let  sum = a + b ;
    return sum ;
}

console.log(add (3,5));

// Function Exressions (another meth0d of creating a function)
const greeting = function(name){
    console.log("Hello "+ name);
}
greeting("Kamal");

//Arrow Functions
const greeting1 = (name, age) => {
console.log("Hello " + name + " you are  "+ age + " years old.");
}

greeting1("aagyat", 23);
const sum = (a,b)=> {
    return (a+b);
}
console.log(sum(3,6));
//  returning object from an arrow function need adding paranthesis as below 

const getuser = () => ({
        name: "kamal",
        program : "BCE"
});

console.log(getuser)

const greeting2 = (name) => console.log("Hello ");


//Arrow function and this 
//most important tricky concept 
//Regular functions have their own this depending on how they are called and arrow functions do not have their own this . they inherit this from the surrounding lexical scope

const user= {
    name : "kamal",
    greet : function (){
        console.log(this.name);
    }
};

user.greet();
const user1= {
    name : "kamal",
    greet : () => {
        console.log(this.name);
    }
};
user.greet();

//Arguments 
function test(a, b) {
    console.log(arguments);
}

test(10, 20);

// Anonymus function 
// // function () {
//     console.log("Hello");
// }
// this has no name so we cannot call it directly but they are usually passed somewhere that will use them 

// we can use anonymus function as a callback , with map(), filter() etc.

setTimeout(function () {
    console.log("Hello after 2 seconds");
}, 2000);



// IIFE (Immediate Invoked Function Expression )
//A function expression that is created and immediately executed.

(function () {
    console.log("Hello from IIFE");
})();
//IIFE with argument 
(function (name) {
    console.log("Hello " + name);
})("Kamal");

//IIFE with return value 
const result = (function (){
    return 10+20;
})();
console.log(result)

//IIFEs were commonly used to create a private scope.