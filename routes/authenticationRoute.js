const express = require('express');
const router = express.Router();
const { login, signup } = require('../controllers/loginController');
const authenticateUser = require('../middleware/authenticateUser');

// Routes
router.post('/login', login);
router.post('/signup', signup);

// Test route to check if auth routes are working
router.get('/test', (req, res) => {
  res.status(200).json({ 
    message: 'Authentication routes are working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      signup: 'POST /api/signup',
      login: 'POST /api/login',
      checkAuth: 'GET /api/check-auth',
      logout: 'POST /api/logout'
    }
  });
});

// Database health check
router.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };
  
  res.status(dbState === 1 ? 200 : 503).json({
    database: {
      status: states[dbState],
      state: dbState,
      host: mongoose.connection.host || 'Unknown',
      name: mongoose.connection.name || 'Unknown'
    },
    server: {
      status: 'Running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  });
});

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