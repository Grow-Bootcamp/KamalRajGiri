import "dotenv/config" ;

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";

console.log("Google Client ID loaded:", Boolean(process.env.GOOGLE_CLIENT_ID));
console.log("Google Client Secret loaded:", Boolean(process.env.GOOGLE_CLIENT_SECRET));
console.log("Google Callback URL loaded:", Boolean(process.env.GOOGLE_CALLBACK_URL));
console.log("JWT Secret loaded:", Boolean(process.env.JWT_SECRET));
console.log("Khalti Secret Key loaded:", Boolean(process.env.KHALTI_SECRET_KEY));

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Google Khalti Demo API is running!",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
