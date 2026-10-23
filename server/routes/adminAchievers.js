const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Achiever = require('../models/Achiever');
const { requireAdmin, requireCsrf } = require('../middleware/requireAdmin');

router.use(requireAdmin);
router.use(requireCsrf);

// GET /api/admin/achievers
router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { achievement: { $regex: search.trim(), $options: 'i' } },
        { batch: { $regex: search.trim(), $options: 'i' } }
      ];
    }
    const achievers = await Achiever.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: achievers.length,
      data: achievers
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/achievers
router.post('/', async (req, res, next) => {
  try {
    const { name, initials, achievement, batch, quote, bgColor, textColor, badgeVariant, isActive, order } = req.body;

    if (!name || !achievement || !quote) {
      return res.status(400).json({
        success: false,
        message: 'Name, achievement, and quote are required.'
      });
    }

    const computedInitials = initials ? String(initials).trim().toUpperCase() :
      name.split(' ').map(n => n[0]).filter(Boolean).slice(-2).join('').toUpperCase();

    const newAchiever = new Achiever({
      name: String(name).trim(),
      initials: computedInitials,
      achievement: String(achievement).trim(),
      batch: batch ? String(batch).trim() : '2025',
      quote: String(quote).trim(),
      bgColor: bgColor || '#c7d2fe',
      textColor: textColor || '#3730a3',
      badgeVariant: badgeVariant || 'badge-amber',
      isActive: isActive !== false,
      order: typeof order === 'number' ? order : 0
    });

    const saved = await newAchiever.save();
    res.status(201).json({
      success: true,
      message: 'Achiever added successfully',
      data: saved
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/achievers/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const allowed = ['name', 'initials', 'achievement', 'batch', 'quote', 'bgColor', 'textColor', 'badgeVariant', 'isActive', 'order'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updated = await Achiever.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Achiever not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Achiever updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/achievers/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const deleted = await Achiever.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Achiever not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Achiever deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
