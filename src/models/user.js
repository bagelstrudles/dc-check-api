const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { supabase, handleSupabaseError } = require('../services/supabaseService');

/**
 * User model for interacting with the users table in Supabase
 */
class User {
  /**
   * Find a user by email
   * @param {string} email - User email
   * @returns {Object|null} - User object or null if not found
   */
  async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  /**
   * Find a user by ID
   * @param {string} id - User ID
   * @returns {Object} - User object
   */
  async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, role, created_at, updated_at')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Object} - Created user
   */
  async create(userData) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const newUser = {
        username: userData.username,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        role: userData.role || 'user'
      };

      // Insert into database
      const { data, error } = await supabase
        .from('users')
        .insert([newUser])
        .select('id, username, email, role, created_at')
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  /**
   * Check if login credentials are valid
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object|null} - User object or null if invalid
   */
  async validateCredentials(email, password) {
    try {
      // Find user by email
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error || !user) {
        return null;
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  /**
   * Generate JWT token for a user
   * @param {Object} user - User object
   * @returns {string} - JWT token
   */
  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  /**
   * Update a user
   * @param {string} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Object} - Updated user
   */
  async update(id, userData) {
    try {
      // If password is being updated, hash it
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
      }

      // If email is being updated, lowercase it
      if (userData.email) {
        userData.email = userData.email.toLowerCase();
      }

      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', id)
        .select('id, username, email, role, created_at, updated_at')
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }
}

module.exports = new User();
