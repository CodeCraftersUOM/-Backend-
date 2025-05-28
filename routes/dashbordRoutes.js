const express = require('express');
const router = express.Router();
const userController = require('../controllers/userContrllers');
const authenticateUser = require('../middleware/authenticateUser')

// ✅ Get all users (already added)
router.get('/getUsers', authenticateUser,userController.getAllUsers);

// ✅ Get a single user by ID
router.get('/getSingleUser/', authenticateUser, userController.getUserById);

// ✅ Create a new user
router.post('/createUser', authenticateUser, userController.createUser);

// ✅ Update an existing user
router.put('/updateUser/:id', authenticateUser, userController.updateUser);

// ✅ Delete a user
router.delete('/deleteUser/:id', authenticateUser, userController.deleteUser);

// ✅ Toggle user active status
router.patch('/toggleUserStatus/:id', authenticateUser, userController.toggleUserStatus);

// ✅ Get dashboard statistics
router.get('/dashboardStats', authenticateUser, userController.getDashboardStats);

// ✅ Get recent users
router.get('/recentUsers', authenticateUser, userController.getRecentUsers);

module.exports = router;
