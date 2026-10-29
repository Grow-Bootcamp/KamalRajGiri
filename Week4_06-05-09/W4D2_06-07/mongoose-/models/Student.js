const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Student name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters']
        },

        email: {
            type: String,
            unique: true,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [
                /^\S+@\S+\.\S+$/,
                'Please provide a valid email'
            ]
        },

        age: {
            type: Number,
            required: [true, 'Age is required'],
            min: [16, 'Age cannot be less than 16'],
            max: [100, 'Age cannot exceed 100']
        },

        course: {
            type: String,
            required: [true, 'Course is required'],
            enum: {
                values: [
                    'Computer Engineering',
                    'Computer Science',
                    'BCA',
                    'BIT'
                ],
                message: 'Invalid course'
            }
        },

        semester: {
            type: Number,
            required: true,
            min: [1, 'Semester must be at least 1'],
            max: [8, 'Semester cannot exceed 8']
        }
    },
    {
        timestamps: true
    }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;