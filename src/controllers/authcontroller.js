const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

/**
 * Register a new user
 * @route POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return next(new AppError('Passwords do not match', 400));
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return next(new AppError('User with that email already exists', 400));
    }

    // Create new user (role is set to 'admin' for initial setup, change later)
    const newUser = await User.create({
      username,
      email,
      password,
      role: 'admin'
    });

    // Generate token
    const token = User.generateToken(newUser);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // Validate credentials
    const user = await User.validateCredentials(email, password);
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Generate token
    const token = User.generateToken(user);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
exports.getProfile = async (req, res, next) => {
  try {
    // User is already attached to req by auth middleware
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update user password
 * @route PATCH /api/auth/password
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check if all fields are provided
    if (!currentPassword || !newPassword || !confirmPassword) {
      return next(new AppError('Please provide all password fields', 400));
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return next(new AppError('New passwords do not match', 400));
    }

    // Validate current password
    const user = await User.validateCredentials(req.user.email, currentPassword);
    if (!user) {
      return next(new AppError('Current password is incorrect', 401));
    }

    // Update password
    await User.update(req.user.id, { password: newPassword });

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (err) {
    next(err);
  }
};
