console.log(" String Properties and Methods in JavaScript");

// String properties and methods are used to manipulate and interact with string data in JavaScript. Strings are sequences of characters, and JavaScript provides various built-in properties and methods to work with them.

// String properties provide information about the string, such as its length. The length property returns the number of characters in a string.
// let str= 'Hello, World!';
// let str = `Hello, World!`;
let str = "   Hello, World!    ";
console.log("String: " + str);
console.log("Length of the string: " + str.length);

console.log(str[1]); // Accessing character at index 1


console.log("Uppercase : " + str.toUpperCase()); // Converts the string to uppercase
console.log("Lowercase : " + str.toLowerCase()); // Converts the string to lowercase

console.log("Trimmed String: " + str.trim()); // Removes whitespace from both ends of the string and doesnot remove whitespace from the middle of the string

let str2 = "Hello, JavaScript!";
console.log("Original String: " + str2);
console.log("Slice (7, 17): " + str2.slice(7, 17)); // Extracts a section of the string from index 7 to 17 (not including 17)
console.log("slice(-6): " + str2.slice(-6)); // Extracts the last 6 characters of the string
console.log("Substring (0, 5): " + str2.substring(0, 5)); // Extracts a section of the string from index 0 to 5 (not including 5)
console.log("substr (-6): " + str2.substring(-6)); // negative index is treated as 0, so it extracts from the start of the string to the end

let fruits = "Apple, Banana, Cherry";
let str3 ="Hello world this is a test string";
console.log("split(' '): " + str3.split(" ")); 
console.log("split(', '): " + fruits.split(", ")); // Splits the string into an array of substrings based on the specified separator

let str4 = "Hello, World!";
console.log("original string: " + str4);
console.log("Replace 'World' with 'JavaScript': " + str4.replace("World", "JavaScript")); // Replaces a specified value with another value in the string

let str5 = "apple banana apple cherry";
console.log("original string: " + str5);
console.log("Replace all 'apple' with 'orange': " + str5.replaceAll("apple", "orange")); // Replaces all occurrences of a specified value with another value in the string

console.log("Includes 'banana': " + str5.includes("banana")); // Checks if the string contains a specified value and returns true or false
console.log("includes 'grapes': " + str5.includes("grapes")); 