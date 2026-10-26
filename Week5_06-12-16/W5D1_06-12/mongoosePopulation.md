# Mongoose Population
suppose we have a student collection and course collection where course belongs to student .

Student
----------------
_id
name
email
course

And

Course
----------------
_id
name
duration

we can store this course in every student 
Student
{
   name: "Kamal",
   course: {
      name: "Computer Engineering",
      duration: 4
   }
}
but this duplicates data.
Instead we use refrence. there is a course and many student stores its _id. But here as well we get problem. suppose MongoDB gives us:

Student
{
   name: "Kamal",
   course: ObjectId("ABC123")
}

when our API response needs student name, course name, course duration , we only have course : ObjectId("ABC123"), but we need to obtain the actual Course document That's Where `populate()` comes in .

# What does populate() do?
Think of it as "Mongoose, I have a reference to another document. Go and retrieve that referenced document for me."

# Referencing vs Population

They are not the same thing. 
*Refrencing* defines the relationship
`Student → Course` and stores `course: ObjectId`

*Population* retrives the refrenced document when querying.
`Schema refrence → stores relationship → populate() → retrives related document` 


# populate() is not  MongoDB JOIN
MongoDB itself has mechanisms such as $lookup for aggregation-based joins. Mongoose's `.populate()` is a Mongoose-level feature that resolves references between documents/models.

so `populate != SQL JOIN`  


SQL → JOIN
MongoDB aggregation → $lookup
Mongoose reference resolution → populate()


*const students = await Student.find().populate("course");*


# Populate a specific field
*const studentCourse = await Student.find().populate("course","name");*
This help returning unnecessary data.


# Multiple Referencing

const studentSchema = new mongoose.Schema({
    name: String,

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },

    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    }
});