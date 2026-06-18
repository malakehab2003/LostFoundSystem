import stripe from "../utils/stripe.js";
import { User } from "../models/db.js";

export const createPaymentIntentService = async (amount, currency = "usd", products, userId) => {
    if (!amount) {
        throw new Error("Amount is required");
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: ["card"],
        metadata: {
            products: JSON.stringify(products),
            userId: userId,
        }
    });

    return paymentIntent;
}


export const handleSuccessfulPayment = async (paymentIntent) => {
    try {
        const userId = paymentIntent.metadata?.userId;

        const products = JSON.parse(
            paymentIntent.metadata?.products || "[]"
        );

        console.log("Payment succeeded", {
            paymentIntentId: paymentIntent.id,
            userId,
            products,
        });

    } catch (err) {
        console.log("Handler error:", err.message);
    }
};