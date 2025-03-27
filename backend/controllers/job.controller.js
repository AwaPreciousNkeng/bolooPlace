import Job from "../models/job.model.js";
import cloudinary from "../services/cloudinary.js";

export const createJob = async (req, res) => {
    try {
        const { title, description, budget, deadline } = req.body;

        if (!title || !description || !budget || !deadline) {
            return res.status(400).json({ success: false, message: "Please fill all required fields" });
        }

        let imageUrl = "";

        // Ensure the frontend is sending an actual image file
        if (req.files && req.files.image) {
            const file = req.files.image;

            // Validate file type (only allow images)
            if (!file.mimetype.startsWith("image/")) {
                return res.status(400).json({ success: false, message: "Only image files are allowed" });
            }

            // Upload to Cloudinary
            const cloudinaryResponse = await cloudinary.uploader.upload(file.tempFilePath, { folder: "jobs" });
            imageUrl = cloudinaryResponse.secure_url;
        }

        const newJob = new Job({
            title,
            description,
            budget,
            deadline: new Date(deadline), // Ensure it's stored as a Date
            image: imageUrl,
            employer: req.user.id,
        });

        await newJob.save();

        res.status(201).json({ success: true, message: "Job created successfully", newJob });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({});//find all jobs
        res.status(200).json({success: true, jobs});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
};

export const applyToJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({success: false, message: "Job not found"});
        }
        if (!job.applicants.includes(req.user.id)) {
            job.applicants.push(req.user.id);
            await job.save();
        }
        res.status(200).json({success: true, message: "Applied to job", job});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
};

export const searchJobs = async (req, res) => {
    try {
        const {query} = req.query;

        if (!query) {
            return res.status(400).json({success: false, message: "Search query is required"});
        }

        const jobs = await Job.find({
            $or: [
                {title: {$regex: query, $options: "i"}}, // Case-insensitive title search
                {description: {$regex: query, $options: "i"}}, // Case-insensitive description search
            ],
        });

        res.status(200).json({success: true, jobs});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
};