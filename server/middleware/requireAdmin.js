const Admin = require('../models/Admin');
const { verifyToken } = require('../config/token');

/**
 * Authentication Middleware:
 * Supports both HTTP-only Session Cookie AND Authorization Bearer Token.
 * This guarantees seamless authentication across cross-origin deployments (like Render Static Site + Render Web Service).
 */
const requireAdmin = async (req, res, next) => {
  try {
    let adminId = req.session ? req.session.adminId : null;

    // Check Authorization header fallback
    const authHeader = req.headers.authorization;
    if (!adminId && authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const verified = verifyToken(token);
      if (verified && verified.id) {
        adminId = verified.id;
        req.tokenVerified = true;
      }
    }

    // Check custom x-admin-token header fallback
    if (!adminId && req.headers['x-admin-token']) {
      const verified = verifyToken(req.headers['x-admin-token']);
      if (verified && verified.id) {
        adminId = verified.id;
        req.tokenVerified = true;
      }
    }

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to access admin resources.'
      });
    }

    const admin = await Admin.findById(adminId).select('-password');
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
 * CSRF Protection Middleware:
 * Validates CSRF token for cookie-based requests.
 * Requests carrying an Authorization Bearer token are inherently immune to CSRF.
 */
const requireCsrf = (req, res, next) => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Exempt auth login
  if (req.path === '/login') {
    return next();
  }

  // Token-authenticated requests are inherently CSRF-safe
  if (req.tokenVerified || (req.headers.authorization && req.headers.authorization.startsWith('Bearer '))) {
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
