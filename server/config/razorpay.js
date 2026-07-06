import Razorpay from "razorpay"; // Import the Razorpay library for payment processing
import { config } from "dotenv"; 
config(); 


// Rezorpay configuration for payment processing.
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export default razorpay; 