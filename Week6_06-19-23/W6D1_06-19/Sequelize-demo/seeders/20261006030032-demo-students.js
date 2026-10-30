"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("students", [
      {
        name: "Kamal",
        email: "kamal@gmail.com",
        age: 22,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Aagyat",
        email: "aagyat@gmail.com",
        age: 21,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Anjana",
        email: "anjana@gmail.com",
        age: 22,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("students", null, {});
  },
};