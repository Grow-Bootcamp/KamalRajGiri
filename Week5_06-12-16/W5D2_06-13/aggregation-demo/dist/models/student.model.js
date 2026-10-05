import mongoose from "mongoose";
const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    semester: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
StudentSchema.virtual("academicLevel").get(function () {
    if (this.semester <= 2)
        return "Beginner";
    if (this.semester <= 4)
        return "Intermediate";
    if (this.semester <= 6)
        return "Advanced";
    return "Final Year";
});
const Student = mongoose.model("Student", StudentSchema);
export default Student;
//# sourceMappingURL=student.model.js.map