const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

/**
 * Generate JWT token for admin
 */
const generateToken = (adminId) => {
    return jwt.sign({ id: adminId }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
};

/**
 * @route   POST /api/admin/register
 * @desc    Register a new admin
 * @access  Public (should be restricted in production)
 */
const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin with this email already exists",
            });
        }

        // Create new admin
        const admin = await Admin.create({
            email,
            password,
        });

        // Generate token
        const token = generateToken(admin._id);

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: {
                admin: {
                    id: admin._id,
                    email: admin.email,
                    isActive: admin.isActive,
                    createdAt: admin.createdAt,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/admin/login
 * @desc    Login admin and return JWT token
 * @access  Public
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find admin and include password field
        const admin = await Admin.findOne({ email }).select("+password");

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message:
                    "Admin account is deactivated. Please contact support.",
            });
        }

        // Verify password
        const isPasswordValid = await admin.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Update last login
        await admin.updateLastLogin();

        // Generate token
        const token = generateToken(admin._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                admin: {
                    id: admin._id,
                    email: admin.email,
                    lastLogin: admin.lastLogin,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/admin/me
 * @desc    Get current admin profile
 * @access  Private (requires authentication)
 */
const getMe = async (req, res, next) => {
    try {
        // req.admin is set by authenticate middleware
        res.status(200).json({
            success: true,
            data: {
                admin: {
                    id: req.admin._id,
                    email: req.admin.email,
                    isActive: req.admin.isActive,
                    createdAt: req.admin.createdAt,
                    lastLogin: req.admin.lastLogin,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe,
};
