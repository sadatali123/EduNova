import Payment from "../models/payment.model.js";
import razorpay from "../config/razorpay.js";
import { config } from "dotenv";
config();
import AppError from "../utils/error.util.js";
import crypto from "crypto"


const getRazorpayApiKey = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: " Razorpay API key fetched successfully",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};



const buySubscription = async (req, res, next) => {
  try {
    const { id } = req.user; // get the user id from the request object
    const user = await User.findById(id); // check if the user exists in the database?

    if (!user) {
      return next(new AppError("Unauthorized, please login", 401));
    }

    if (user.role === "ADMIN") {
      return next(new AppError("Admin cannot buy subscription", 400));
    }

    const subscription = await razorpay.subscriptions.create({
      // create a new subscription using the Razorpay API
      plan_id: process.env.RAZORPAY_PLAN_ID,
      customer_notify: 1,
    });

    user.subscription.id = subscription.id; // store the subscription id in the user's subscription object
    user.subscription.status = subscription.status;

    await user.save(); // save the user object to the database

    res.status(200).json({
      sucess: true,
      message: "Subscription created successfully",
      subscriptionId: subscription.id,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};



const verifySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = req.body;

    const user = await User.findById(id); // check user exist or not

    if (!user) {
      return next(new AppError("Unauthorized, please login", 401));
    }

    const subscriptionId = user.subscription.id; // get the subscription id from the user's subscription object

    // using cyrpto generate a new signature using the razorpay_payment_id and subscriptionId and compare it with the razorpay_signature sent by the client or payment gateway. If they don't match, return an error.
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_payment_id + "|" + subscriptionId, "utf-8")
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return next(
        new AppError("Payment verification failed, Please try again", 500),
      );
    }

    await Payment.create({
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    });

    user.subscription.status = "active";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};



const cancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("Unauthorized, please login", 401));
    }

    if (user.role === "ADMIN") {
      return next(new AppError("Admin cannot buy subscription", 400));
    }

    const subscriptionId = user.subscription.id; // get the user subscription id from the user's subscription object

    const subscription = await razorpay.subscriptions.cancel(subscriptionId); // cancel the subscription using the Razorpay API

    user.subscription.status = subscription.status; // update the user's subscription status to cancelled
    await user.save(); // save the user object to the database
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};



const allPayments = async (req, res, next) => {
  try {
        const{count,skip}=req.query;
    
        const allPayments = await razorpay.subscriptions.all({
            count: count ? count : 10, // If count is sent then use that else default to 10
            skip: skip ? skip : 0
        })

        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

         const finalMonths = {
            January: 0,
            February: 0,
            March: 0,
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0,
        };

        const monthlyWisePayments = allPayments.items.map((payment) => {
            // We are using payment.start_at which is in unix time, so we are converting it to Human readable format using Date()
            const monthsInNumbers = new Date(payment.start_at * 1000);
        
            return monthNames[monthsInNumbers.getMonth()];
        });

          monthlyWisePayments.map((month) => {
            Object.keys(finalMonths).forEach((objMonth) => {
              if (month === objMonth) {
                finalMonths[month] += 1;
              }
            });
          });

          const monthlySalesRecord = [];

          Object.keys(finalMonths).forEach((monthName) => {
            monthlySalesRecord.push(finalMonths[monthName]);
          });
        
          res.status(200).json({
            success: true,
            message: 'All payments',
            allPayments,
            finalMonths,
            monthlySalesRecord,
          });
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        ) 
    }
};




export {
  getRazorpayApiKey,
  buySubscription,
  verifySubscription,
  cancelSubscription,
  allPayments,
};
