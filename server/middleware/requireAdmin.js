const Admin = require('../models/Admin');

/**
 * Authentication Middleware:
 * Verifies that the request has an active, valid administrator session.
 * Protects every /api/admin/* route independently of frontend routing.
 */
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.session || !req.session.adminId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to access admin resources.'
      });
    }

    const admin = await Admin.findById(req.session.adminId).select('-password');
    if (!admin || !admin.isActive) {
      if (req.session) {
        req.session.destroy(() => {});
      }
      return res.status(401).json({
        success: false,
        message: 'Session invalid or account deactivated. Please log in again.'
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication verification error'
    });
  }
};

/**
 * CSRF Protection Middleware for Session-Authenticated State-Changing Requests:
 * Validates the X-CSRF-Token header on POST, PUT, PATCH, and DELETE requests.
 */
const requireCsrf = (req, res, next) => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Exempt auth login because the session/token is generated during login
  if (req.path === '/login') {
    return next();
  }

  const clientToken = req.headers['x-csrf-token'];
  const sessionToken = req.session ? req.session.csrfToken : null;

  if (!clientToken || !sessionToken || clientToken !== sessionToken) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or missing CSRF token'
    });
  }

  next();
};

module.exports = {
  requireAdmin,
  requireCsrf
};
