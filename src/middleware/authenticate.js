const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const config = require("../config/config");

/**
 * Middleware to protect routes that require authentication
 * Verifies JWT token and attaches admin info to request object
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }

        // Extract token (format: "Bearer TOKEN")
        const token = authHeader.substring(7);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Invalid token format.",
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, config.jwt.secret);

            // Find admin by ID from token
            const admin = await Admin.findById(decoded.id).select("-password");

            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: "Admin not found. Token may be invalid.",
                });
            }

            if (!admin.isActive) {
                return res.status(403).json({
                    success: false,
                    message: "Admin account is deactivated.",
                });
            }

            // Attach admin info to request object
            req.admin = admin;
            next();
        } catch (error) {
            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token.",
                });
            }
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Token has expired. Please login again.",
                });
            }
            throw error;
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during authentication.",
        });
    }
};

module.exports = authenticate;
