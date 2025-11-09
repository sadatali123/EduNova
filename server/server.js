import app from "./app.js"; 
import { config } from "dotenv";
config();  // Load environment variables from .env file

const PORT = process.env.PORT || 5000; // Use the PORT environment variable or default to 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);   
});



