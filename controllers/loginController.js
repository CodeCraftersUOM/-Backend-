require('dotenv').config();
const User = require('../models/userModel'); // assuming your model file is named authModel.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';

// Signup Controller
const { sendWelcomeEmail } = require('../utils/email');
const signup = async (req, res) => {
  const { username, email, password, fullName, dateOfBirth, gender } = req.body;

  // Check MongoDB connection status
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: "Database connection unavailable. Please try again later.",
      status: "Service temporarily unavailable"
    });
  }

  // Enhanced validation
  if (!username || !email || !password || !fullName || !dateOfBirth || !gender) {
    return res.status(400).json({ 
      message: "All fields are required",
      required: ["username", "email", "password", "fullName", "dateOfBirth", "gender"]
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  // Validate gender
  const validGenders = ['male', 'female', 'other', 'prefer-not-to-say'];
  if (!validGenders.includes(gender.toLowerCase())) {
    return res.status(400).json({ 
      message: "Invalid gender value",
      validOptions: validGenders
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    // Check if username is already taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      dateOfBirth: new Date(dateOfBirth),
      gender: gender.toLowerCase(),
    });
    
    console.log('New user created:', {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName
    });

    // Send welcome email after successful signup
    try {
      await sendWelcomeEmail(newUser.email, newUser.fullName);
      console.log('Welcome email sent successfully');
    } catch (emailErr) {
      console.error('Error sending welcome email:', emailErr);
      // Do not fail signup if email fails
    }

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        gender: newUser.gender,
        dateOfBirth: newUser.dateOfBirth
      }
    });
  } catch (err) {
    console.error("Signup Error:", err);
    
    // Handle specific MongoDB errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ 
        message: `${field} already exists`,
        error: "Duplicate field error"
      });
    }
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: "Validation failed",
        errors: errors
      });
    }
    
    res.status(500).json({ 
      message: "Server Error during signup",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  // Check MongoDB connection status
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: "Database connection unavailable. Please try again later.",
      status: "Service temporarily unavailable"
    });
  }

  // Validation
  if (!email || !password) {
    return res.status(400).json({ 
      message: "Email and password are required",
      missing: !email ? ['email'] : ['password']
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if JWT_SECRET is available
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set token in HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    });

    console.log('User logged in successfully:', {
      id: user._id,
      username: user.username,
      email: user.email
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ 
      message: "Server Error during login",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

module.exports = { signup, login };
