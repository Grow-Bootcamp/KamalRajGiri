require('dotenv').config();

const connectDB = require('./db');
const Student = require('./models/Student');

async function start() {
    await connectDB();
    // -----------------------------------------------------
    // Create a new student document using the Student model
    // ------------------------------------------------------
    // const student = new Student({
    //     name: 'K',
    //     age: 2,
    //     email: 'kamal',
    //     course: 'Computer',
    //     semester: 17
    // });
    try{
    const student1 = new Student({ // Create a new student document
        name: 'Kamal Raj Giri',
        age: 23,
        email: 'kamal@example.com',
        course: 'Computer Engineering',
        semester: 7
    }
);
await student1.save(); // Save the student document to the database
    }catch(err){
        if (err.code === 11000) {
        console.log("Kamal already exists in database (skipped creation).");
    } else {
        console.error('Error creating student:', err.message);
    }}
    
    // await student.save();
    // console.log(student);
    
    try{
    const student2 = await Student.create ({ // Create and save a new student document in one step
        name: 'Sita Sharma',
        age: 21,
        email: 'sita@example.com',
        course: 'Computer Engineering',
        semester: 7
    }
);
    }catch(err){
        if (err.code === 11000) {
        console.log("Sita already exists in database (skipped creation).");
    } else {
        console.error('Error creating student:');
    }}
    // console.log(student1);
    // console.log(student2);



    // -----------------------------------------------------
    // Read all student documents from the database
    // ------------------------------------------------------

    const  studentsall = await Student.find({
        //find all students with course 'Computer Engineering' and semester 7
        course: 'Computer Engineering',
        semester: 7
    }); // Retrieve all student documents from the database
    console.log(" All students:  ",studentsall);

    const studentfind1 = await Student.findOne({
        // find one student with course 'Computer Engineering' and semester 7
        course: 'Computer Engineering',
        semester: 7
    });
    console.log("Student filtered by findone:")
    console.log("Student: ",studentfind1);

    const studentById = await Student.findById('6ab50cb5e4b2ab6b69429086'); // Retrieve a student document by its ID
    console.log("Student filtered by findById:")
    console.log("Student: ",studentById);

    // select specific fields from the student documents
    const studentsSelectedFields = await Student.find().select('name email course'); // Retrieve all student documents and select only the name, email, and course fields
    console.log("Students with selected fields: ", studentsSelectedFields);

    // Excluding specific fields from the student documents
    const studentsExcludedFields = await Student.find().select('-age -semester -__v'); // Retrieve all student documents and exclude the age, semester, and __v fields
    console.log("Students with excluded fields: ", studentsExcludedFields);

    // sorting the student documents by name in ascending order
    const studentsSortedByName = await Student.find().sort('name');
    console.log("Students sorted by name: ", studentsSortedByName);
    // sorting the student documents by name in descending order
    const studentsSortedByNameDesc = await Student.find().sort('-name');
    console.log("Students sorted by name (descending): ", studentsSortedByNameDesc);

    // limiting the number of student documents returned
    const studentsLimited = await Student.find().limit(2);
    console.log("Students limited to 2: ", studentsLimited);

    // combination of filtering, selecting, sorting, and limiting student documents
    const studentsFiltered = await Student.find({ course: 'Computer Engineering' })
        .select('name email')
        .sort('name')
        .limit(2);
    console.log("Filtered students: ", studentsFiltered);

    // counting the number of student documents that match a specific filter
    const countStudents = await Student.countDocuments({ course: 'Computer Engineering' });
    console.log("Count of students in Computer Engineering: ", countStudents);
    
    // Pagination: Retrieve student documents in pages
    const page = 1;
    const limit = 3;
    const studentsPaginated = await Student.find()
        .skip((page - 1) * limit)
        .limit(limit);
    console.log(`Students on page ${page}: `, studentsPaginated);
    // importand when building express api with pagination and filtering, sorting, selecting fields, etc.

    // .lean() method to return plain JavaScript objects instead of Mongoose documents
    const studentsLean = await Student.find().lean();
    console.log("Students as plain JavaScript objects: ", studentsLean); // good for read only operations, as it improves performance and reduces memory usage.

    // $gt, $gte, $lt, $lte : greater than, greater than or equal to, less than, less than or equal to 





    // ----------------------------------------------------------
    // Update a student document in the database
    // ----------------------------------------------------------

    const findStudentById = await Student.findByIdAndUpdate('6ab52977640bf79b29d73bc5',{
        name : 'Anjana Parbat',
        semester: 6
    },{
        new: true, // return the updated document
        runValidators: true // run schema validators on the update
    });
    console.log("Updated student: ", findStudentById);

    const kamalUpdate = await Student.findByIdAndUpdate('6ab52977640bf79b29d73bc4',{
        $set: {
            semester: 8
        }
    },{
        new: true, // return the updated document
        runValidators: true // run schema validators on the update
    });
    console.log("Updated Kamal's semester: ", kamalUpdate);

    const Aagyat = await Student.findByIdAndUpdate('6ab531e09d9c181ec0c7e750',{
        $inc: { semester: 1 } // increment the semester by 1
    },
    {
        new: true, // return the updated document
        runValidators: true // run schema validators on the update
    }
);

const result = await Student.updateOne(
    {
        email: 'ka@eg.com'
    },
    {
        $set: {
            course: 'Computer Science',
            semester: 8
        }
    },
    {
        runValidators: true, // run schema validators on the update
    }
);
console.log("Updated student: ", result);
// updateOne() returns an object with the number of documents matched and modified, rather than the updated document itself.

const manyResult = await Student.updateMany({
    course: 'Computer Science'
},
{
    $set: {
        semester: 7
    }
},
{
    runValidators: true, // run schema validators on the update
    }
);
console.log("Updated many students: ", manyResult);

const deleteById = await Student.findByIdAndDelete('6ab53d629d9c181ec0c7e751');
console.log("Deleted student by ID: ", deleteById);

const deleteOne = await Student.deleteOne({
    name : 'delete'
});
console.log("Deleted one student: ", deleteOne);

// use deleteOne() to delete a single document that matches the filter criteria, and deleteMany() to delete multiple documents that match the filter criteria.

const deleteMany = await Student.deleteMany({
    course: 'BCA'
});
console.log("Deleted many students: ", deleteMany);

// Dangerous {} filter : This will delete all documents in the collection.

// await Student.deleteMany({});

}
start();