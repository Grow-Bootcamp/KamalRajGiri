const express = require("express");
const fs = require("fs").promises;

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from Express!");
});

app.get("/about", (req, res) => {
    res.send("This is the About page.");
});

app.get("/message", async (req, res) => {
    try {
        const data = await fs.readFile("./data/message.txt", "utf-8"); // Asynchronous read : does not block the execution, returns a promise

        res.send(data);
    } catch (error) {
        console.error("Error reading file:", error);
        res.status(500).send("Error reading message file");
    }
});

app.listen(3000, () => {
    console.log("Express server running on port 3000");
});