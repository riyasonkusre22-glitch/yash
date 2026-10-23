const express = require('express');
const router = express.Router();
const QuizAttempt = require('../models/QuizAttempt');
const { requireAdmin } = require('../middleware/requireAdmin');

router.use(requireAdmin);

// GET /api/admin/quiz/attempts - Read-only student quiz activity
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [attempts, total] = await Promise.all([
      QuizAttempt.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      QuizAttempt.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: attempts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
