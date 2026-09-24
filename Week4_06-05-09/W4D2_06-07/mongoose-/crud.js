require('dotenv').config();

const connectDB = require('./db');
const Student = require('./models/Student');

async function crudDemo() {
    await connectDB();

    // CREATE
    const student = await Student.create({
        name: 'CRUD Practice Student',
        email: 'crud.practice@example.com',
        age: 22,
        course: 'Computer Engineering',
        semester: 7
    });

    console.log('\n1. CREATED:');
    console.log(student);

    // READ
    const foundStudent = await Student.findById(student._id);

    console.log('\n2. READ:');
    console.log(foundStudent);

    // UPDATE
    const updatedStudent = await Student.findByIdAndUpdate(
        student._id,
        {
            $set: {
                semester: 8
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    console.log('\n3. UPDATED:');
    console.log(updatedStudent);

    // DELETE
    const deletedStudent = await Student.findByIdAndDelete(
        student._id
    );

    console.log('\n4. DELETED:');
    console.log(deletedStudent);

    // VERIFY DELETE
    const verifyStudent = await Student.findById(student._id);

    console.log('\n5. VERIFICATION:');
    console.log(verifyStudent);
}

crudDemo();