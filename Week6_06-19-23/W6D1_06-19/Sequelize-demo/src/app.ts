import { sequelize } from "./config/db.js";
import Student from "./models/student.model.js";

console.log("Student model:", Student);
console.log("Starting database connection...");
console.log("REGISTERED MODELS:", Object.keys(sequelize.models));

async function start() {
  try {
    await sequelize.authenticate();

    console.log("Database connected successfully!");
    await sequelize.sync();
    console.log("Database synchronized successfully!");

    const student = await Student.create({
  name: "Kamal",
  email: "kamal@gmail.com",
  age: 22,
});

const students = await Student.findAll();
// console.log(students);
console.log(student.toJSON());



await Student.update(
    {
        age: 23,
    },
    {
        where: {
            email: "kamal@gmail.com",
        },
    }
);
const studentdisplay = await Student.findOne({
    where: {
        email: "kamal@gmail.com",
    },
});
console.log(student?.toJSON());


await Student.destroy({
    where: {
        email: "kamal@gmail.com",
    },
});
console.log(student.toJSON());

await Student.create({
  name: "Test",
  email: "wrong-email",
  age: 15,
});

  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

start();