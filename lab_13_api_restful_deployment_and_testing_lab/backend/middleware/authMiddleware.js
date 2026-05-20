/**
 * Student Name: Hammad Shahzad (ID: 232071)
 * Partner/Context: Kashan Zafar (ID: 232051)
 * Course: BSSE-VI-B & A
 * Lab Title: API RESTful Deployment and Testing Lab
 * File: middleware/authMiddleware.js - Custom JWT Authentication Middleware
 */

const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate requests via JWT tokens and optionally enforce role-based access.
 * @param {string} requiredRole - Optional role limit (e.g. 'admin')
 */
const authMiddleware = (requiredRole) => {
    return (req, res, next) => {
        // Read authorization header
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access Denied: No token provided."
            });
        }

        // Support both "Bearer <token>" format and direct "<token>" format
        let token = authHeader;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        try {
            // Verify JWT token using secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Inject user payload into the request object
            req.user = decoded;

            // Check if a specific role is required and whether user matches
            if (requiredRole && decoded.role !== requiredRole) {
                return res.status(403).json({
                    success: false,
                    message: `Access Denied: Requires '${requiredRole}' privileges.`
                });
            }

            // Move to the next middleware or controller
            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Access Denied: Invalid or expired token."
            });
        }
    };
};

module.exports = authMiddleware;
