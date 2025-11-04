const express = require("express");
const { body } = require("express-validator");
const adminController = require("../controllers/adminController");
const authenticate = require("../middleware/authenticate");
const validate = require("../middleware/validate");

const router = express.Router();

/**
 * Validation rules for admin registration
 */
const registerValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

/**
 * Validation rules for admin login
 */
const loginValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
];

// POST /api/admin/register - Register new admin
router.post(
    "/register",
    registerValidation,
    validate,
    adminController.register
);

// POST /api/admin/login - Login admin
router.post("/login", loginValidation, validate, adminController.login);

// GET /api/admin/me - Get current admin profile (protected)
router.get("/me", authenticate, adminController.getMe);

module.exports = router;
