import { model, Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    razorpay_payment_id: {
      type: String,
      required: true,
    },
    razorpay_subscription_id: {
      type: String,
      required: true,
    },
    razorpay_signature: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Payment = model("Payment", paymentSchema); // Create a model named "Payment" using the paymentSchema

export default Payment; // Export the Payment model for use in other parts of the application
