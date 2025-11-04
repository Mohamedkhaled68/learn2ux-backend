require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./src/models/Admin");
const config = require("./src/config/config");

/**
 * Script to create the first admin user
 */
const createFirstAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongodb.uri, {
            dbName: config.mongodb.dbName,
            ...config.mongodb.options,
        });

        console.log("✅ Connected to MongoDB");

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: "aa@aa.com" });

        if (existingAdmin) {
            console.log("⚠️  Admin with email aa@aa.com already exists!");
            console.log("Admin ID:", existingAdmin._id);
            console.log("Created at:", existingAdmin.createdAt);
            process.exit(0);
        }

        // Create first admin
        const admin = await Admin.create({
            email: "aa@aa.com",
            password: "Pass123$",
        });

        console.log("\n🎉 First admin created successfully!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("Email:", admin.email);
        console.log("Password: Pass123$");
        console.log("Admin ID:", admin._id);
        console.log("Created at:", admin.createdAt);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("\n✅ You can now login with these credentials");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating admin:", error.message);
        process.exit(1);
    }
};

createFirstAdmin();
