import express from "express";
import {
  initiatePayment,
  checkPaymentStatus,
} from "../controllers/payment.controller.js";
import {protectRoutes} from "../middlewares/auth.middleware.js"; // Include authentication middleware if needed

const router = express.Router();

// Route to initiate a payment
router.post("/initiate", protectRoutes, initiatePayment);

// Route to check the payment status
router.get("/status/:transactionId", protectRoutes, checkPaymentStatus);

export default router;
