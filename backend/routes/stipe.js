import express from "express";
import { createPaymentIntent } from "../controller/stripeController.js";
import * as middleware from '../utils/middlewares.js';


const router = express.Router();

router.post("/create-payment", middleware.AuthRequest, createPaymentIntent);

export default router;