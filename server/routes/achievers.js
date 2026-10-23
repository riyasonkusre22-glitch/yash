const express = require('express');
const router = express.Router();
const Achiever = require('../models/Achiever');

// GET /api/achievers - Only returns active achievers publicly
router.get('/', async (req, res, next) => {
  try {
    const achievers = await Achiever.find({ isActive: { $ne: false } }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: achievers.length,
      data: achievers
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
