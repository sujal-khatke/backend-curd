const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: {
    type: String,
    unique: true,
    required: true,
    match: [/^\d{10}$/, "Invalid phone number"]  // Ensures phone is exactly 10 digits
  },
  password: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  images: [{
    url: String,
    path: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, 
{ 
  timestamps: true, 
  // 🔥 Add this line:
  validateModifiedOnly: true 
});

// 🔒 Password Hashing Middleware
userSchema.pre("save", async function(next) {
  if (this.isModified("password") && !this.password.startsWith("$2b$")) {
    this.password = await bcrypt.hash(this.password, 12); 
  }
  next();
});

// 🔑 Password Comparison Method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
