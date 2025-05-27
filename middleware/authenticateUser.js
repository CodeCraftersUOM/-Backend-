const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // adjust the path if needed

const authenticateUser = async (req, res, next) => {
  try {
    
    const token = req.cookies.token;
    

    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    console.error('Auth Error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateUser;
