import "dotenv/config";
import express, {Request, Response, NextFunction} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

const app = express();

app.use(express.json());

const PORT = Number(process.env.PORT ?? 5000);
const secret = process.env.JWT_SECRET;

if (!secret || secret.length <32 ){
    throw new Error(
    "JWT_SECRET must be configured with a strong secret.");
}
const JWT_SECRET: string = secret;
const users =[
    {
        id: 1,
        name: "Kamal",
        email: "kamal@example.com",
        password: "Kamal123"
    }
];

interface AuthTokenPayload extends JwtPayload{
    userId: number;
    email: string;
}

// Adding an authenticated user property to express requests
declare global{
    namespace Express {
        interface Request{
            user?:AuthTokenPayload;
        }
    }
}

// Public route :no authentication required.
app.get("/api/public",(_req:Request, res: Response)=>{
    res.json({
        message: "Hello, Everyone is welcome here."
    });
});

// login routes: validate credentials and issuea JWT
app.post("/api/auth/login",(req:Request, res:Response)=>{
    const {email, password} = req.body ?? {};
    if(
        typeof email !== "string" || typeof password !== "string"
    ){
        return res.status(400).json({
            message: "Email and password are required."
        });
    }
    const user = users.find(
        (u) => u.email === email && u.password === password
    );
    if (!user){
        return res.status(401).json({
            message: "Invalid email or password."
        });
    }
    const token = jwt.sign ({
        userId : user.id, email : user.email},
    JWT_SECRET,
    {
        algorithm : "HS256",
        expiresIn: "1h"
    }
);
return res.json({
    message : "Login successful.",
    token
});
});

// Authentication Middleware.
function authenticateToken(
    req: Request, res : Response, next: NextFunction
){
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")){
        return res.status(401).json({
            message: "Authentication token required."
        });
    }
    const token = authHeader.slice("Bearer ".length).trim();

    if(!token){
        return res.status(401).json({
            message: "Authentication token required."
        });
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET,{algorithms:["HS256"]});
        if (typeof decoded === "string" || typeof decoded.userId !== "number" || typeof decoded.email !== "string"){
            return res.status(401).json({
                message: "Invalid authentication token."
            });
        }
        req.user = decoded as AuthTokenPayload;
        return next();
    }catch {
        return res.status(401).json({
            message: "Invalid or expired authentication token."
        });
    }
}


// Protected route: Middleware runs before the handler.
app.get("/api/profile", authenticateToken, (req : Request, res:Response)=> {
    return res.json({
        message: `Welcome back, ${req.user!.email}`, 
        user: {
            id:req.user!.userId,
            email:req.user!.email
        }
    });
});
export {app};