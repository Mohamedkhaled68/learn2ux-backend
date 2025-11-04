require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./src/models/Admin");
const config = require("./src/config/config");

/**
 * Script to test admin login
 */
const testLogin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongodb.uri, {
            dbName: config.mongodb.dbName,
            ...config.mongodb.options,
        });

        console.log("✅ Connected to MongoDB\n");

        // Find admin
        const admin = await Admin.findOne({ email: "aa@aa.com" }).select(
            "+password"
        );

        if (!admin) {
            console.log("❌ Admin not found!");
            process.exit(1);
        }

        console.log("📧 Admin found:");
        console.log("Email:", admin.email);
        console.log("ID:", admin._id);
        console.log("Active:", admin.isActive);
        console.log("Created:", admin.createdAt);

        // Test password
        const isMatch = await admin.comparePassword("Pass123$");

        if (isMatch) {
            console.log("\n✅ Password verification: SUCCESS");
            console.log("\n🎉 Admin login credentials are working!");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("Email: aa@aa.com");
            console.log("Password: Pass123$");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        } else {
            console.log("\n❌ Password verification: FAILED");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

testLogin();
