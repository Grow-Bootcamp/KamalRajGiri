
//seed data
let stName = "     kamal Giri    ";
let stId = "BECT19";
let stAge = 23;
let stEmail = "girikamal2087@gmail.com";
let stCourse = "BCE";
let sub = ["Math", "Physics", "Chemistry", "English", "Nepali"];
let marks = {
    Math: 90,
    Physics: 85,
    Chemistry: 80,
    English: 75,
    Nepali: 70
}


console.log("String Properties and Methods in JavaScript - Student Data");
console.log("Student Name: " + stName.trim());
console.log("Student Name (uppercase): " + stName.trim().toUpperCase());
console.log("Email contains @: " + stEmail.includes("@"));
console.log("Student ID: " + stId);
console.log("Student ID starts with 'BE': " + stId.startsWith("BE"));
console.log("Email ends with '.com': " + stEmail.endsWith(".com"));
console.log( "Programme : " + stId.slice(2,4));

console.log( "Student Name (split): " + stName.trim().split(" "));

console.log( "Subject (replace): " + stName.replace("     kamal Giri    ", "Kamal"));
console.log("Name length : " + stName.trim().length);


console.log("Conditional Statements in JavaScript - Student Marks");

if (stName.length<0){
    console.log("Name is empty");
}
else{
    console.log("Student Name: " + stName.trim());
}
let count =0;
let totalMarks = 0;
for (let i = 0; i < sub.length; i++) {
    let subject = sub[i];
    let mark = marks[subject];
    
    console.log(`Subject: ${subject}, Mark: ${mark}(makr<40) ? console.log( "remarks : Fail") : console.log( "remarks : Pass")`);
    if (mark < 40) {
        count++;
    }
    totalMarks += mark;
    
}
console.log(`Number of failed subjects: ${count}`);
console.log(`Total Marks: ${totalMarks}`);
let avg = totalMarks / sub.length;
console.log(`Average Marks: ${totalMarks / sub.length}`);

let grade = "";
if (avg >= 80) {
grade = "A";
    console.log("Grade: A");
}
else if (avg >= 60) {
    grade = "B";
    console.log("Grade: B");
}
else if (avg >= 40) {
    grade = "C";
    console.log("Grade: C");
}
else {
    grade = "F";
    console.log("Grade: F");
}

if (count > 0) {
    console.log("Overall Remarks: Fail");
}
else {
    console.log("Overall Remarks: Pass");
}

console.log("Student Grade: " + grade);

switch (grade) {
    case "A":
        console.log("Excellent performance");
        break;
    case "B":
        console.log("Good performance");
        break;
    case "C":
        console.log("Average performance");
        break;
    case "F":
        console.log("Poor performance");    
    break;
    default:
        console.log("Invalid grade");
        break;
}