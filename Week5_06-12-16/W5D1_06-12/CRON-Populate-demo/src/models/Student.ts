import mongoose from "mongoose";
const StudentSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        minlength : 3,
        maxlength : 20,
        trim: true,
    },
    age: {
        type: Number,
        required : true,
        min: 16,
        max: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match:[ /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Please Enter a valid email address']
    },
    course:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Course',
        required: true,
    }
},
{timestamps: true}
)
const Student = mongoose.model('Student', StudentSchema);
export {Student};