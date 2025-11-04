const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category ID is required"],
        index: true,
    },
    questionEn: {
        type: String,
        required: [true, "English question is required"],
        trim: true,
        maxlength: [500, "Question cannot exceed 500 characters"],
    },
    questionAr: {
        type: String,
        required: [true, "Arabic question is required"],
        trim: true,
        maxlength: [500, "Question cannot exceed 500 characters"],
    },
    answerEn: {
        type: String,
        required: [true, "English answer is required"],
        trim: true,
    },
    answerAr: {
        type: String,
        required: [true, "Arabic answer is required"],
        trim: true,
    },
    links: [
        {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    // Basic URL validation
                    return /^(https?:\/\/)/.test(v);
                },
                message:
                    "Please enter a valid URL starting with http:// or https://",
            },
        },
    ],
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
questionSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// Update the updatedAt timestamp before updating
questionSchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

// Index for faster queries by category
questionSchema.index({ categoryId: 1, createdAt: -1 });

module.exports = mongoose.model("Question", questionSchema);
