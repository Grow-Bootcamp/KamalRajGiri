console.log("Conditional Statements in JavaScript:");

console.log("If else if  statement example:");
//if else if statements are used to execute different blocks of code based on different conditions.

let age= 25;

if (age < 18) {
    console.log("You are a minor.");
}
else if (age >= 18 && age < 65) {
    console.log("You are an adult.");
}
else {
    console.log("You are a senior citizen.");
}

console.log("Switch statement example:");
// Switch statements are used to compare a variable against multiple values.
let day=3;
switch (day) {
    case 1: 
    console.log("Sunday");
    break;
    // The break statement is used to exit the switch statement once a case has been executed.
    case 2:
    console.log("Monday");
    break;  
    case 3:
    console.log("Tuesday");
    break;
    case 4:
    console.log("Wednesday");
    break;
    case 5:
    console.log("Thursday");
    break;
    case 6:
    console.log("Friday");
    break;
    case 7:
    console.log("Saturday");
    break;
    default:
        // The default case is executed if none of the cases match the value of the variable.
    console.log("Invalid day");
}

// Use switch when: You're checking one value against several exact possibilities. and use if-else when: You have complex conditions or ranges of values to check.