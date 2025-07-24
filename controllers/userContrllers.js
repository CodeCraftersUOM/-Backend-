const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { sendWelcomeEmail } = require('../utils/email');

// LOGIN
const login = async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase(); // Normalize email
    const password = req.body.password;

    const user = await User.findOne({ email });

    if (!user) {
      console.log('User found: null');
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// SIGNUP
const signup = async (req, res) => {
  try {
    const {
      username,
      fullName,
      email,
      password,
      dateOfBirth,
      gender,
      phoneNumber,
      role = 'user'
    } = req.body;

    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      fullName,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      dateOfBirth,
      gender,
      phoneNumber,
      role
    });

    const savedUser = await newUser.save();

    try {
      await sendWelcomeEmail(savedUser.email, savedUser.fullName || savedUser.username);
    } catch (emailErr) {
      console.error('Failed to send welcome email:', emailErr);
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        fullName: savedUser.fullName
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error signing up',
      error: error.message
    });
  }
};

// ALL YOUR ORIGINAL FUNCTIONS BELOW

// Get all users for dashboard
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || '';

    const searchFilter = search ? {
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(searchFilter)
      .select('username fullName email phoneNumber isActive role createdAt lastLogin')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id)
      .select('username fullName email phoneNumber isActive role createdAt updatedAt lastLogin profileImage');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).select('username fullName email phoneNumber isActive role updatedAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// Toggle user active status
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: user._id,
        username: user.username,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersLastMonth = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        newUsersLastMonth,
        usersByRole
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// Get recent users
const getRecentUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const recentUsers = await User.find()
      .select('username fullName email createdAt')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      data: recentUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent users',
      error: error.message
    });
  }
};

module.exports = {
  login,
  signup,
  getAllUsers,
  getUserById,
  createUser: signup, // Optional alias for backwards compatibility
  updateUser,
  deleteUser,
  toggleUserStatus,
  getDashboardStats,
  getRecentUsers
};
