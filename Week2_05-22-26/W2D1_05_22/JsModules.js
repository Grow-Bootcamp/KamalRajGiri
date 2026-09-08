import {
    add,
    subtract
} from "./math.js"; // import multiple functions from math.js
import {multiply } from "./math.js"; // import multiply function from math.js
import { divide as div } from "./math.js"; // import divide function from math.js and rename it to div
import square from "./math.js"; // import default function from math.js // for default function , no need to use curly braces because there is only one default function in the file
// if there are multiple default functions in the file, then we can use curly braces to import them

console.log(add(10, 5));
console.log(subtract(10, 5));
console.log(multiply(10, 5));
console.log(div(10, 5));
console.log(square(5));
// console.log(PI); // this will throw an error because PI is not exported from math.js

