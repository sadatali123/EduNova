// server setup file
import express from "express";
import cors from "cors";
const app = express();
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import morgan from "morgan";
config();

// Middleware and route setups 
app.use(express.json()); // Body parser middleware

app.use(cors({
    origin: process.env.FRONTEND_URL, // frontend's origin
    credentials: true
}))

app.use(cookieParser()); // Cookie parser middleware -- it converts the cookie header into javascript object

app.use(morgan("dev")); // HTTP request logger middleware

app.use("/ping", (req, res) => {
    res.status(200).json({ message: "pong" });
});

// Routes of 3 modules 

// 404 handler - the last middleware
app.use((req, res) => {
    res.status(404).json({ message: "OOPs! Route not found" });
});

export default app;
