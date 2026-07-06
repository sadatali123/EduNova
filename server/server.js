// this file is the entry point of the server application.
import app from "./app.js";
import { config } from "dotenv";
config();  // Load environment variables from .env file
import connectionToDB from "./config/dbConnection.js";
import cloudinary from "cloudinary";


const PORT = process.env.PORT || 5000; // Use the PORT environment variable or default to 5000

// Cloudinary configuration for file storage service
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})



app.listen(PORT, async () => {
    await connectionToDB();
    console.log(`Server is running on port ${PORT}`);  
}); 







