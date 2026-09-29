import mongoose from "mongoose";
const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        minlength: 3,
        maxlength: 10
    },
    duration: {
        type: Number,
        required: true,
        min: 1,
    }
}, { timestamps: true });
const Course = mongoose.model('Course', CourseSchema);
export { Course };
//# sourceMappingURL=Course.js.map