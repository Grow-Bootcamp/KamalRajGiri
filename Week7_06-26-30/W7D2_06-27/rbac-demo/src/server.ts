import { app } from "./app";
import { env } from "./config/env";
import { sequelize, connectDatabase } from "./config/db";
import "./models/user.model";

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    // Development only: creates missing tables and adds missing columns.
    // Do not use force: true because it drops existing tables.
    await sequelize.sync();

    app.listen(env.PORT, () => {
      console.log(`Server running at http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exitCode = 1;
  }
}

void startServer();