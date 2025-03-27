import express from "express";
import { protectRoutes } from "../middlewares/auth.middleware.js";
import { getUserProfile, updateUserProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", protectRoutes, getUserProfile);
router.put("/profile/:id", protectRoutes, updateUserProfile);

export default router;
