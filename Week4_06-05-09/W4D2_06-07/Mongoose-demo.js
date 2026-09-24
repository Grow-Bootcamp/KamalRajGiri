const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/bootcamp_db")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("Connection error:", error);
    });

    const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    age: {
        type: Number,
        required: true,
        min: 16,
        max: 60
    },

    course: {
        type: String,
        required: true
    }
});

