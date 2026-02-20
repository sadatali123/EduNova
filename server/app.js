// server setup file
import express from "express";
import cors from "cors";
const app = express();
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import morgan from "morgan";
config();
import userRoutes from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

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
app.use("/api/v1/users", userRoutes);


// 404 handler - the last middleware
app.use((req, res) => {
    res.status(404).json({ message: "OOPs! Route not found" });
});

app.use(errorMiddleware); // Global error handling middleware

export default app;
