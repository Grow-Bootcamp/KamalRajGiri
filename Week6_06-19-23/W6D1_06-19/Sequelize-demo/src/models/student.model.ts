import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
console.log("🔥 STUDENT MODEL FILE LOADED");

class Student extends Model {}

console.log("🔥 INITIALIZING STUDENT MODEL");
Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty",
        },
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Invalid email address",
        },
      },
    },

    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [16],
          msg: "Age must be at least 16",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Student",
    tableName: "students",
    timestamps: true,
  }
);

export default Student;