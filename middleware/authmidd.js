const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user"); // Import User model

const router = express.Router();

// Login Route
router.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // 🔹 Find user in MongoDB
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 🔹 Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 🔹 Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || "your_secret_key",
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
