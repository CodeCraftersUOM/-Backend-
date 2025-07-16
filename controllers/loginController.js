const User = require('../models/userModel'); // assuming your model file is named authModel.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;


// Signup Controller
const { sendWelcomeEmail } = require('../utils/email');
const signup = async (req, res) => {
  const { username, email, password, fullName, dateOfBirth, gender } = req.body;

  if (!username || !email || !password || !fullName || !dateOfBirth || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      dateOfBirth: new Date(dateOfBirth),
      gender: gender.toLowerCase(),
    });
    console.log(fullName, dateOfBirth, gender);
    console.log(newUser);

    // Send welcome email after successful signup
    try {
      await sendWelcomeEmail(newUser.email, newUser.fullName);
    } catch (emailErr) {
      console.error('Error sending welcome email:', emailErr);
      // Do not fail signup if email fails
    }

    res.status(201).json({
      message: "Signup successful",
      user: {
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        gender: newUser.gender
      }
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Login Controller
const login = async (req, res) => {
  
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    

    // Set token in HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000   ,
      sameSite: 'strict'
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        gender: user.gender
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { signup, login };
