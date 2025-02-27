const express = require("express");
const {
    createUser,
    login,
    getUsers,
    updateUser,
    deleteUser,
    uploadImage,
    getImage,
    deleteImage
} = require("../controller/usercontroller");

const authMiddleware = require("../middleware/authmidd");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();
// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"), false);
        }
    }
});


// Public Routes
router.post("/register", createUser);
router.post("/login", login);

// Protected Routes
router.get("/users", authMiddleware, getUsers);
router.put("/users/:id", authMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, deleteUser);

// Image Upload Routes
router.post("/users/:id/upload", authMiddleware, upload.single("image"), uploadImage);
router.get("/users/:userId/image", authMiddleware, getImage);
router.delete("/users/:userId/images/:imageId", authMiddleware, deleteImage);

module.exports = router;
