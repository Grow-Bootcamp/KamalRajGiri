import express from "express";
import { sequelize } from "./config/db.js";
import transferRoutes from "./routes/transfer.routes.js";

const app = express();

app.use(express.json());

app.use("/api", transferRoutes);

async function start() {
    try {
        await sequelize.authenticate();

        console.log("Database connected");

        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });

    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

start();