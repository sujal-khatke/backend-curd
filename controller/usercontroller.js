const User = require("../models/user");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
const uploadDir = path.join(__dirname, "../uploads");

// ✅ Signup (Create User & Return Token)
const createUser = async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        // 🔍 Check for existing user
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({
                message: existingUser.email === email ? "Email already exists" : "Phone number already exists"
            });
        }

        // ✅ Create and Save User
        const user = new User({ email, phone, password });
        await user.save();

        // 🔐 Generate JWT Token
        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "7d" });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                email: user.email,
                phone: user.phone,
            },
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ✅ Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 🔐 Generate JWT Token
        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "7d" });

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                phone: user.phone,
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get All Users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update User
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ✅ Delete User
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Upload Image (Fixed)
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(req.params.id, { imageUrl }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Image uploaded successfully", imageUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Retrieve User Image
const getImage = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user || !user.imageUrl) {
            return res.status(404).json({ message: "Image not found" });
        }

        const imagePath = path.join(__dirname, "../uploads", path.basename(user.imageUrl));

        if (fs.existsSync(imagePath)) {
            return res.sendFile(imagePath);
        } else {
            return res.status(404).json({ message: "Image file not found on server" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Delete User Image
const deleteImage = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user || !user.imageUrl) {
            return res.status(404).json({ message: "User or image not found" });
        }

        // Absolute Path for Image
        const imagePath = path.join(__dirname, "../uploads", path.basename(user.imageUrl));
        console.log("Deleting file:", imagePath);

        // Delete Image if Exists
        if (fs.existsSync(imagePath)) {
            try {
                fs.unlinkSync(imagePath);
            } catch (err) {
                console.error("Error deleting file:", err);
                return res.status(500).json({ message: "Error deleting image file" });
            }
        } else {
            console.log("File not found in uploads folder.");
        }

        // Remove Image Reference from DB
        user.imageUrl = "";
        await user.save();

        res.json({ message: "Image deleted successfully" });
    } catch (error) {
        console.error("Delete API Error:", error);
        res.status(500).json({ error: error.message });
    }
};


// ✅ Export Controllers (Now It Works!)
module.exports = {
    createUser,
    login,
    getUsers,
    updateUser,
    deleteUser,
    uploadImage,
    getImage,
    deleteImage
};
