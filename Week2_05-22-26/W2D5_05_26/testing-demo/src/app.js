// import {add, subtract} from './utils/calculator.js';

const express = require('express');
const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.get("/api/users", (req, res) => {
    res.status(200).json([{id :1, name: "Kamal"}]);
});

app.post("/api/users", (req, res) => {
    const { name } = req.body;  
    const newUser = { id: 2, name };
    res.status(201).json(newUser);
});



module.exports = app;