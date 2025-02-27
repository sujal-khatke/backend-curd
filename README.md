# Backend CRUD Project

This project is a **Node.js, Express, and MongoDB** based RESTful API that includes user authentication, CRUD operations, and image management. It uses **JWT (JSON Web Token)** for authentication and **Multer** for file uploads.

## 🚀 Features

- **User Authentication:**
  - User Signup (Registration)
  - User Login with JWT token generation
  - Protected routes using JWT middleware

- **User Management (CRUD):**
  - Create a new user
  - Retrieve all users
  - Update user details
  - Delete user

- **Image Management:**
  - Upload user images (using Multer)
  - Retrieve user images
  - Delete user images

---

## 📂 Project Structure
backend-crud/ ├── config/ │ └── db.js # MongoDB connection configuration ├── controllers/ │ └── userController.js # User API controllers ├── middleware/ │ └── authMiddleware.js # JWT authentication middleware ├── models/ │ └── user.js # Mongoose User schema ├── routes/ │ └── userRoutes.js # Express routes for users & images ├── uploads/ # Directory for uploaded images ├── .env # Environment variables (not pushed to GitHub) ├── package.json # Node.js dependencies └── server.js # Main server file

## 🔧 Prerequisites

- **Node.js** (v18 or later)
- **MongoDB** (local or MongoDB Atlas)
- **Git**
- **npm** (Node Package Manager)

---

## 🛠 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/backend-crud.git
   cd backend-crud
2. Install dependencies:
   npm install

📌 API Endpoints

🔐 Authentication:
- POST /api/register - Register a new user
- POST /api/login - Login and get a JWT token

👤 User Management (Protected Routes):
- GET /api/users - Get all users
- PUT /api/users/:id - Update a user

DELETE /api/users/:id - Delete a user
🖼️ Image Management (Protected Routes):
- POST /api/users/:id/upload - Upload an image (use form-data)
- GET /api/users/:userId/image - Get the user’s image
- DELETE /api/users/:userId/images/:imageId - Delete an image

🛠 Testing
- Use Postman to test API endpoints.
- For uploaded images, check:

🔄 Git Instructions

- git init
- git add .
- git commit -m "Initial commit"
- git branch -M main
- git remote add origin https://github.com/your-username/backend-crud.git
- git push -u origin main

