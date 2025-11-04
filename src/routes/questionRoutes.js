const express = require("express");
const { body, param, query } = require("express-validator");
const questionController = require("../controllers/questionController");
const authenticate = require("../middleware/authenticate");
const validate = require("../middleware/validate");

const router = express.Router();

/**
 * Validation rules for creating/updating questions
 */
const questionValidation = [
    body("categoryId")
        .notEmpty()
        .withMessage("Category ID is required")
        .isMongoId()
        .withMessage("Invalid category ID format"),
    body("questionEn")
        .trim()
        .notEmpty()
        .withMessage("English question is required")
        .isLength({ max: 500 })
        .withMessage("English question cannot exceed 500 characters"),
    body("questionAr")
        .trim()
        .notEmpty()
        .withMessage("Arabic question is required")
        .isLength({ max: 500 })
        .withMessage("Arabic question cannot exceed 500 characters"),
    body("answerEn")
        .trim()
        .notEmpty()
        .withMessage("English answer is required"),
    body("answerAr").trim().notEmpty().withMessage("Arabic answer is required"),
    body("links").optional().isArray().withMessage("Links must be an array"),
    body("links.*")
        .optional()
        .trim()
        .isURL({ protocols: ["http", "https"] })
        .withMessage(
            "Each link must be a valid URL starting with http:// or https://"
        ),
];

/**
 * Validation for ID parameter
 */
const idValidation = [
    param("id").isMongoId().withMessage("Invalid question ID format"),
];

/**
 * Validation for query parameters
 */
const queryValidation = [
    query("categoryId")
        .optional()
        .isMongoId()
        .withMessage("Invalid category ID format"),
];

// GET /api/questions - Get all questions (public, can filter by categoryId)
router.get("/", queryValidation, validate, questionController.getAllQuestions);

// GET /api/questions/:id - Get question by ID (public)
router.get("/:id", idValidation, validate, questionController.getQuestionById);

// POST /api/questions - Create question (admin only)
router.post(
    "/",
    authenticate,
    questionValidation,
    validate,
    questionController.createQuestion
);

// PUT /api/questions/:id - Update question (admin only)
router.put(
    "/:id",
    authenticate,
    idValidation,
    questionValidation,
    validate,
    questionController.updateQuestion
);

// DELETE /api/questions/:id - Delete question (admin only)
router.delete(
    "/:id",
    authenticate,
    idValidation,
    validate,
    questionController.deleteQuestion
);

module.exports = router;
