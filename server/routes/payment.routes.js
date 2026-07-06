import {Router} from "express"; // import Router from express
const router = Router(); // create a new router instance
import {getRazorpayApiKey, buySubscription, verifySubscription, cancelSubscription, allPayments} from "../controllers/payment.controller.js"; // import controller functions from payment.controller.js
import { isLoggedIn, authorizedRoles } from "../middlewares/auth.middleware.js";

router
    .route("/razorpay-key") 
    .get(
        isLoggedIn,
        getRazorpayApiKey     // getRazorpayApiKey is a controller function that will return the Razorpay API key to the client.
    ); 


router
    .route("/subscribe")
    .post(
        isLoggedIn,
        buySubscription      // buySubscription is a controller function that will create a new subscription for the user and return the subscription ID to the client.       
);


router
    .route("/verify")
    .post(
        isLoggedIn,
        verifySubscription   // verifySubscription is a controller function that will verify the subscription.

    ); 


router
    .route("/unsubscribe")
    .post(
        isLoggedIn,
        cancelSubscription   // cancelSubscription is a controller function that will cancel the user's subscription.
    ); 



// routes for admin to see all payments details made by users
router
    .route("/")
    .get(
        isLoggedIn,
        authorizedRoles("ADMIN"), // only admin can access this route
        allPayments  // allPayments is a controller function that will return all payments details made by users.
    );



export default router;