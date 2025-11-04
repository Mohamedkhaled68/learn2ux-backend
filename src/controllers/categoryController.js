const Category = require("../models/Category");

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/categories/:id
 * @desc    Get a single category by ID
 * @access  Public
 */
const getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Private (Admin only)
 */
const createCategory = async (req, res, next) => {
    try {
        const {
            titleEn,
            titleAr,
            descriptionEn,
            descriptionAr,
            textColor,
            borderColor,
            icon,
            iconType,
        } = req.body;

        const category = await Category.create({
            titleEn,
            titleAr,
            descriptionEn,
            descriptionAr,
            textColor,
            borderColor,
            icon,
            iconType,
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/categories/:id
 * @desc    Update a category
 * @access  Private (Admin only)
 */
const updateCategory = async (req, res, next) => {
    try {
        const {
            titleEn,
            titleAr,
            descriptionEn,
            descriptionAr,
            textColor,
            borderColor,
            icon,
            iconType,
        } = req.body;

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                titleEn,
                titleAr,
                descriptionEn,
                descriptionAr,
                textColor,
                borderColor,
                icon,
                iconType,
            },
            {
                new: true, // Return updated document
                runValidators: true, // Run model validators
            }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category
 * @access  Private (Admin only)
 */
const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Optional: Delete all questions associated with this category
        const Question = require("../models/Question");
        await Question.deleteMany({ categoryId: req.params.id });

        res.status(200).json({
            success: true,
            message: "Category and associated questions deleted successfully",
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
