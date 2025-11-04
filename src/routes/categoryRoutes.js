const express = require("express");
const { body, param } = require("express-validator");
const categoryController = require("../controllers/categoryController");
const authenticate = require("../middleware/authenticate");
const validate = require("../middleware/validate");

const router = express.Router();

/**
 * Validation rules for creating/updating categories
 */
const categoryValidation = [
    body("titleEn")
        .trim()
        .notEmpty()
        .withMessage("English title is required")
        .isLength({ max: 200 })
        .withMessage("English title cannot exceed 200 characters"),
    body("titleAr")
        .trim()
        .notEmpty()
        .withMessage("Arabic title is required")
        .isLength({ max: 200 })
        .withMessage("Arabic title cannot exceed 200 characters"),
    body("descriptionEn")
        .trim()
        .notEmpty()
        .withMessage("English description is required")
        .isLength({ max: 1000 })
        .withMessage("English description cannot exceed 1000 characters"),
    body("descriptionAr")
        .trim()
        .notEmpty()
        .withMessage("Arabic description is required")
        .isLength({ max: 1000 })
        .withMessage("Arabic description cannot exceed 1000 characters"),
    body("textColor")
        .trim()
        .notEmpty()
        .withMessage("Text color is required")
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .withMessage(
            "Text color must be a valid hex color (e.g., #FF5733 or #F57)"
        ),
    body("borderColor")
        .trim()
        .notEmpty()
        .withMessage("Border color is required")
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .withMessage(
            "Border color must be a valid hex color (e.g., #FF5733 or #F57)"
        ),
    body("icon")
        .notEmpty()
        .withMessage("Icon is required")
        .isString()
        .withMessage("Icon must be a string (base64 encoded or file path)"),
    body("iconType")
        .notEmpty()
        .withMessage("Icon type is required")
        .isIn(["svg", "png"])
        .withMessage("Icon type must be either 'svg' or 'png'"),
];

/**
 * Validation for ID parameter
 */
const idValidation = [
    param("id").isMongoId().withMessage("Invalid category ID format"),
];

// GET /api/categories - Get all categories (public)
router.get("/", categoryController.getAllCategories);

// GET /api/categories/:id - Get category by ID (public)
router.get("/:id", idValidation, validate, categoryController.getCategoryById);

// POST /api/categories - Create category (admin only)
router.post(
    "/",
    authenticate,
    categoryValidation,
    validate,
    categoryController.createCategory
);

// PUT /api/categories/:id - Update category (admin only)
router.put(
    "/:id",
    authenticate,
    idValidation,
    categoryValidation,
    validate,
    categoryController.updateCategory
);

// DELETE /api/categories/:id - Delete category (admin only)
router.delete(
    "/:id",
    authenticate,
    idValidation,
    validate,
    categoryController.deleteCategory
);

module.exports = router;
