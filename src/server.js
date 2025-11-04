const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/database");
const config = require("./config/config");
const errorHandler = require("./middleware/errorHandler");

// Import routes
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const questionRoutes = require("./routes/questionRoutes");

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
// Security headers
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (
                config.cors.allowedOrigins.indexOf(origin) !== -1 ||
                config.server.env === "development"
            ) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (config.server.env === "development") {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"));
}

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
        environment: config.server.env,
    });
});

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/questions", questionRoutes);

// Root endpoint
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Learn2UX API",
        version: "1.0.0",
        endpoints: {
            health: "/health",
            admin: {
                register: "POST /api/admin/register",
                login: "POST /api/admin/login",
                me: "GET /api/admin/me (requires auth)",
            },
            categories: {
                getAll: "GET /api/categories",
                getById: "GET /api/categories/:id",
                create: "POST /api/categories (requires auth)",
                update: "PUT /api/categories/:id (requires auth)",
                delete: "DELETE /api/categories/:id (requires auth)",
            },
            questions: {
                getAll: "GET /api/questions?categoryId=...",
                getById: "GET /api/questions/:id",
                create: "POST /api/questions (requires auth)",
                update: "PUT /api/questions/:id (requires auth)",
                delete: "DELETE /api/questions/:id (requires auth)",
            },
        },
    });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.server.port;
const server = app.listen(PORT, () => {
    console.log(
        `🚀 Server running in ${config.server.env} mode on port ${PORT}`
    );
    console.log(`📍 API available at http://localhost:${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Promise Rejection:", err);
    // Close server & exit process
    server.close(() => process.exit(1));
});

module.exports = app;
