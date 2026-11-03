import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.routes.js'

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true,
}));

app.use(express.json());
app.use(cookieParser());


app.get('/api/health',(_req,res)=>{
    res.status(200).json({
        status: "ok",
        message: "Auth API is running",
    });
});

app.use('/api/auth', authRoutes);

export default app;