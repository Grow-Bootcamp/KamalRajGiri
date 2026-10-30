
import express from "express";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middleware/error-handler";

export const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);
