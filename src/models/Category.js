const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    titleEn: {
        type: String,
        required: [true, "English title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"],
    },
    titleAr: {
        type: String,
        required: [true, "Arabic title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"],
    },
    descriptionEn: {
        type: String,
        required: [true, "English description is required"],
        trim: true,
        maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    descriptionAr: {
        type: String,
        required: [true, "Arabic description is required"],
        trim: true,
        maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    textColor: {
        type: String,
        required: [true, "Text color is required"],
        trim: true,
        validate: {
            validator: function (v) {
                // Validate hex color format (#RRGGBB or #RGB)
                return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
            },
            message: "Please enter a valid hex color (e.g., #FF5733 or #F57)",
        },
    },
    borderColor: {
        type: String,
        required: [true, "Border color is required"],
        trim: true,
        validate: {
            validator: function (v) {
                // Validate hex color format (#RRGGBB or #RGB)
                return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
            },
            message: "Please enter a valid hex color (e.g., #FF5733 or #F57)",
        },
    },
    icon: {
        type: String, // Will store base64 encoded image or file path
        required: [true, "Icon is required"],
    },
    iconType: {
        type: String,
        enum: ["svg", "png"],
        required: [true, "Icon type is required"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the updatedAt timestamp before saving
categorySchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// Update the updatedAt timestamp before updating
categorySchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

module.exports = mongoose.model("Category", categorySchema);
