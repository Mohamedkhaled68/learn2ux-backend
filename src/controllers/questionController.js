const Question = require("../models/Question");
const Category = require("../models/Category");

/**
 * @route   GET /api/questions
 * @desc    Get all questions (optionally filtered by categoryId)
 * @access  Public
 */
const getAllQuestions = async (req, res, next) => {
    try {
        const { categoryId } = req.query;

        // Build query
        const query = {};
        if (categoryId) {
            query.categoryId = categoryId;
        }

        const questions = await Question.find(query)
            .populate("categoryId", "titleEn titleAr")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/questions/:id
 * @desc    Get a single question by ID
 * @access  Public
 */
const getQuestionById = async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id).populate(
            "categoryId",
            "titleEn titleAr descriptionEn descriptionAr"
        );

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        res.status(200).json({
            success: true,
            data: question,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/questions
 * @desc    Create a new question
 * @access  Private (Admin only)
 */
const createQuestion = async (req, res, next) => {
    try {
        const {
            categoryId,
            questionEn,
            questionAr,
            answerEn,
            answerAr,
            links,
        } = req.body;

        // Verify category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        const newQuestion = await Question.create({
            categoryId,
            questionEn,
            questionAr,
            answerEn,
            answerAr,
            links: links || [],
        });

        // Populate category info
        await newQuestion.populate("categoryId", "titleEn titleAr");

        res.status(201).json({
            success: true,
            message: "Question created successfully",
            data: newQuestion,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/questions/:id
 * @desc    Update a question
 * @access  Private (Admin only)
 */
const updateQuestion = async (req, res, next) => {
    try {
        const {
            categoryId,
            questionEn,
            questionAr,
            answerEn,
            answerAr,
            links,
        } = req.body;

        // If categoryId is being updated, verify it exists
        if (categoryId) {
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
                });
            }
        }

        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id,
            { categoryId, questionEn, questionAr, answerEn, answerAr, links },
            {
                new: true,
                runValidators: true,
            }
        ).populate("categoryId", "titleEn titleAr");

        if (!updatedQuestion) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Question updated successfully",
            data: updatedQuestion,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/questions/:id
 * @desc    Delete a question
 * @access  Private (Admin only)
 */
const deleteQuestion = async (req, res, next) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Question deleted successfully",
            data: question,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
};
