const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Testimonial = require('../models/Testimonial');
const { requireAdmin, requireCsrf } = require('../middleware/requireAdmin');

router.use(requireAdmin);
router.use(requireCsrf);

// GET /api/admin/testimonials
router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { author: { $regex: search.trim(), $options: 'i' } },
        { role: { $regex: search.trim(), $options: 'i' } },
        { quote: { $regex: search.trim(), $options: 'i' } }
      ];
    }
    const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/testimonials
router.post('/', async (req, res, next) => {
  try {
    const { author, role, rating, quote, isApproved, order } = req.body;

    if (!author || !role || !quote) {
      return res.status(400).json({
        success: false,
        message: 'Author, role, and quote are required.'
      });
    }

    const newTestimonial = new Testimonial({
      author: String(author).trim(),
      role: String(role).trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      quote: String(quote).trim(),
      isApproved: isApproved !== false,
      order: typeof order === 'number' ? order : 0
    });

    const saved = await newTestimonial.save();
    res.status(201).json({
      success: true,
      message: 'Testimonial added successfully',
      data: saved
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/testimonials/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const allowed = ['author', 'role', 'rating', 'quote', 'isApproved', 'order'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        if (key === 'rating') {
          updates[key] = Math.min(5, Math.max(1, Number(req.body[key]) || 5));
        } else {
          updates[key] = req.body[key];
        }
      }
    }

    const updated = await Testimonial.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/testimonials/:id/toggle-approval
router.patch('/:id/toggle-approval', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    testimonial.isApproved = !testimonial.isApproved;
    await testimonial.save();

    res.status(200).json({
      success: true,
      message: `Testimonial ${testimonial.isApproved ? 'Approved and Published' : 'Hidden from public'}`,
      data: testimonial
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/testimonials/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
