import { createPaymentIntentService } from "../services/stripeService.js";
import { Product } from "../models/db.js";

export const createPaymentIntent = async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ err: "Products are required" });
        }

        const productIds = products.map(p => p.productId);

        const dbProducts = await Product.findAll({
            where: { id: productIds }
        });

        let totalAmount = 0;
        const stripeProducts = [];

        for (const item of products) {
            const product = dbProducts.find(p => p.id === item.productId);

            if (!product) {
                return res.status(404).json({ err: `Product ${item.productId} not found` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ err: `Not enough stock for ${product.name}` });
            }

            const price = product.price * (1 - product.sale / 100);

            totalAmount += price * item.quantity;

            stripeProducts.push({
                id: product.id,
                name: product.name,
                quantity: item.quantity,
                price
            });
        }

        totalAmount = Math.round(totalAmount * 100);

        const paymentIntent = await createPaymentIntentService(
            totalAmount,
            "usd",
            stripeProducts
        );

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            amount: totalAmount
        });

    } catch (err) {
        res.status(400).json({ err: err.message });
    }
};