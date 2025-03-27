import express from "express";
import {createJob, getJobs, applyToJob, searchJobs} from "../controllers/job.controller.js";
import {protectRoutes} from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/", protectRoutes, createJob);
router.get("/", getJobs);
router.post("/:jobId/apply", protectRoutes, applyToJob);
router.get("/search", searchJobs);

export default router;
