import mongoose from "mongoose";
import { config } from "dotenv";
config(); 


mongoose.set("strictQuery", true);

// here we establish connection to MongoDB database using mongoose
const connectionToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1); // Exit process with failure
    }
};

export default connectionToDB;