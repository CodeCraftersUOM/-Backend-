const express = require('express');
const router = express.Router();
const { login, signup } = require('../controllers/loginController');
const authenticateUser = require('../middleware/authenticateUser');

// Routes
router.post('/login', login);
router.post('/signup', signup);

// Check authentication status
router.get('/check-auth', authenticateUser, (req, res) => {
  // If we reach here, the user is authenticated (middleware passed)
  res.status(200).json({ 
    message: 'User is authenticated', 
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      fullName: req.user.fullName
    }
  });
});

// Logout route
router.post('/logout', (req, res) => {
  // Clear the JWT cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;