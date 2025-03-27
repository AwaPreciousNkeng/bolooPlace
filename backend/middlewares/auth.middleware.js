import { ENV_VARS } from "../config/envVars.js";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';

export const protectRoutes = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: ' Unauthorized - no token provided' });
    }
    try {
        const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ message: 'Unauthorized - user not found' });
        req.user = user;
        next();
    } catch (error) {
        console.error('Error in protectRoutes: ', error.message);
        return res.status(401).json({ message: 'Unauthorized - token is invalid' });
    }
}