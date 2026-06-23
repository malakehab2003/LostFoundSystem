import express from "express";
import { createPaymentIntent, stripeWebhook } from "../controller/stripeController.js";
import * as middleware from '../utils/middlewares.js';


const router = express.Router();

router.post("/create-payment", middleware.AuthRequest, createPaymentIntent);
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

export default router;