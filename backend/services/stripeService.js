import stripe from "../utils/stripe.js";

export const createPaymentIntentService = async (amount, currency = "usd") => {
    if (!amount) {
        throw new Error("Amount is required");
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: ["card"],
    });

    return paymentIntent;
};