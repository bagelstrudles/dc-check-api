const express = require('express');
const { register, login, getProfile, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getProfile);
router.patch('/password', protect, updatePassword);

module.exports = router;
