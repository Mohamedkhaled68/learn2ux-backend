require("dotenv").config();

module.exports = {
    // MongoDB Configuration
    mongodb: {
        uri: process.env.MONGODB_URI,
        dbName: process.env.DB_NAME || "learn2ux",
        options: {
            retryWrites: true,
            w: "majority",
        },
    },

    // Server Configuration
    server: {
        port: process.env.PORT || 5000,
        env: process.env.NODE_ENV || "development",
    },

    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || "fallback_secret_change_me",
        expiresIn: process.env.JWT_EXPIRE || "7d",
    },

    // CORS Configuration
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(",")
            : ["http://localhost:3000", "http://localhost:5173"],
    },
};
