import mongoose from "mongoose";
const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    department: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
CourseSchema.virtual("students", {
    ref: "Student",
    localField: "_id",
    foreignField: "courses",
});
const Course = mongoose.model("Course", CourseSchema);
export default Course;
//# sourceMappingURL=course.model.js.map