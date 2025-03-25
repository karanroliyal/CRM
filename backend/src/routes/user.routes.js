const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { auth, isAdmin, checkPermission } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.use(auth); // Apply authentication middleware to all routes below

// User routes
router.get('/profile', (req, res) => res.json(req.user)); // Get own profile
router.put('/profile', userController.updateUser); // Update own profile
router.post('/change-password', userController.changePassword);

// Admin routes
router.get('/all', isAdmin, userController.getAllUsers);
router.get('/:id', checkPermission('manage_users'), userController.getUserById);
router.put('/:id', checkPermission('manage_users'), userController.updateUser);
router.delete('/:id', isAdmin, userController.deleteUser);

module.exports = router; 