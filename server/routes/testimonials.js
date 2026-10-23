const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

// GET /api/testimonials - Only returns approved testimonials publicly
router.get('/', async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: { $ne: false } }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
