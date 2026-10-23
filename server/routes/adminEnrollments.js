const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Enrollment = require('../models/Enrollment');
const { requireAdmin, requireCsrf } = require('../middleware/requireAdmin');

router.use(requireAdmin);
router.use(requireCsrf);

// GET /api/admin/enrollments - List demo class registrations with search, filter, pagination
router.get('/', async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { studentName: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } },
        { course: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [enrollments, total] = await Promise.all([
      Enrollment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Enrollment.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: enrollments,
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

// PATCH /api/admin/enrollments/:id - Update status or notes
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Enrollment ID format' });
    }

    const { status, notes } = req.body;
    const updates = {};

    if (status !== undefined) {
      const validStatuses = ['Pending', 'Contacted', 'Enrolled', 'Closed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status must be one of: ${validStatuses.join(', ')}`
        });
      }
      updates.status = status;
    }

    if (notes !== undefined) {
      updates.notes = String(notes).trim();
    }

    const updated = await Enrollment.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Enrollment record not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/enrollments/:id - Delete enrollment
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Enrollment ID format' });
    }

    const deleted = await Enrollment.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Enrollment record not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Enrollment record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
