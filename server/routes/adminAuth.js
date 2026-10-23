const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Admin = require('../models/Admin');
const { requireAdmin } = require('../middleware/requireAdmin');
const loginRateLimiter = require('../middleware/loginRateLimiter');

// POST /api/admin/auth/login - Rate-limited secure login
router.post('/login', loginRateLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const sanitizedEmail = String(email).trim().toLowerCase();
    const admin = await Admin.findOne({ email: sanitizedEmail }).select('+password');

    // Generic error to avoid account enumeration
    const genericAuthError = {
      success: false,
      message: 'Invalid credentials. Please verify your email and password.'
    };

    if (!admin || !admin.isActive) {
      return res.status(401).json(genericAuthError);
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json(genericAuthError);
    }

    // Regenerate session to protect against session fixation attacks
    req.session.regenerate((err) => {
      if (err) {
        return next(err);
      }

      req.session.adminId = admin._id;
      req.session.csrfToken = crypto.randomBytes(32).toString('hex');

      admin.lastLogin = new Date();
      admin.save().catch(() => {});

      return res.status(200).json({
        success: true,
        message: 'Authentication successful',
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        },
        csrfToken: req.session.csrfToken
      });
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/auth/me - Check current authentication status
router.get('/me', requireAdmin, async (req, res) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }

  return res.status(200).json({
    success: true,
    admin: {
      id: req.admin._id,
      email: req.admin.email,
      name: req.admin.name,
      role: req.admin.role,
      lastLogin: req.admin.lastLogin
    },
    csrfToken: req.session.csrfToken
  });
});

// POST /api/admin/auth/logout - Invalidate admin session
router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      res.clearCookie('yt_admin_sid', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    });
  } else {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  }
});

module.exports = router;
