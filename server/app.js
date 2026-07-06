// this is the file where all the root path of the server application is defined.
import express from "express";
import cors from "cors";
const app = express();
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import morgan from "morgan";
config();
import userRoutes from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

app.use(express.json()); // Body parser middleware
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies (for form submissions)

app.use(cors({
    origin: process.env.FRONTEND_URL, // frontend's origin
    credentials: true
}))


app.use(cookieParser()); // Cookie parser middleware -- it converts the cookie header into javascript object


app.use(morgan("dev")); // HTTP request logger middleware


app.use("/ping", (req, res) => {
    res.status(200).json({ message: "pong" });
});


// Base Routes   
app.use("/api/v1/users", userRoutes); //base route for user related routes 
app.use("/api/v1/courses", courseRoutes); //base route for course related routes
app.use("/api/v1/payments", paymentRoutes); //base route for payment-- Whenever a request starts with /api/v1/payments, forward it to paymentRoutes for further handling.


// 404 handler - the last middleware
app.use((req, res) => {
    res.status(404).json({ message: "OOPs! Route not found" });
});

app.use(errorMiddleware); // Global error handling middleware

export default app;
