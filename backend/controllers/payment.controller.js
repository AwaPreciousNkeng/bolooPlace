import Payment from "../models/payment.model.js";
import {initiatePay, paymentStatus} from "../services/fapshiApi.js"; // Import the Fapshi API service

// Initiate payment
export const initiatePayment = async (req, res) => {
  try {
    const { amount, email, userId, externalId, redirectUrl, message } = req.body;

    // Validate input data
    if (!amount || !email || !userId || !externalId || !redirectUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Prepare payment data for Fapshi API
    const paymentData = {
      amount,
      email,
      userId,
      externalId,
      redirectUrl,
      message,
    };

    // Call Fapshi API to initiate payment
    const response = await initiatePay(paymentData);

    if (response.statusCode === 200) {
      // Save payment info to database
      const newPayment = new Payment({
        amount,
        email,
        userId,
        externalId,
        status: "pending",
        paymentLink: response.paymentUrl, // Link to complete the payment
      });
      const payment = await newPayment.save();

      res.status(201).json({
        success: true,
        message: "Payment initiated successfully",
        paymentLink: response.paymentUrl, // Send the payment link to the user
        paymentId: payment._id,
      });
    } else {
      res.status(response.statusCode).json({
        success: false,
        message: response.message || "Payment initiation failed",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Check payment status
export const checkPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Validate input
    if (!transactionId) {
      return res
        .status(400)
        .json({ success: false, message: "Transaction ID required" });
    }

    // Call Fapshi API to check payment status
    const statusResponse = await paymentStatus(transactionId);

    if (statusResponse.statusCode === 200) {
      res.status(200).json({
        success: true,
        status: statusResponse.status,
        message: "Payment status retrieved successfully",
      });
    } else {
      res.status(statusResponse.statusCode).json({
        success: false,
        message: statusResponse.message || "Payment status check failed",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
