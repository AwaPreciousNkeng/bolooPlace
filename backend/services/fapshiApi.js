import axios from "axios";
import { ENV_VARS } from "../config/envVars.js";

const baseUrl = "https://live.fapshi.com";
const headers = {
  apiuser: ENV_VARS.FAPSHI_API_USER, // Replace with your Fapshi API user
  apikey: ENV_VARS.FAPSHI_API_KEY, // Replace with your Fapshi API key
};

export const initiatePay = async (data) => {
  try {
    const response = await axios.post(`${baseUrl}/initiate-pay`, data, {
      headers,
    });
    return response.data;
  } catch (error) {
    return error.response
      ? error.response.data
      : { message: "API request failed", statusCode: 500 };
  }
};

export const paymentStatus = async (transId) => {
  try {
    const response = await axios.get(`${baseUrl}/payment-status/${transId}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    return error.response
      ? error.response.data
      : { message: "API request failed", statusCode: 500 };
  }
};
