const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const { requireAdmin, requireCsrf } = require('../middleware/requireAdmin');

router.use(requireAdmin);
router.use(requireCsrf);

// GET /api/admin/courses - List courses with search and filtering
router.get('/', async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { subtitle: { $regex: search.trim(), $options: 'i' } },
        { badge: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [courses, total] = await Promise.all([
      Course.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limitNum),
      Course.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: courses,
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

// GET /api/admin/courses/:id - Single course details
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Course ID format' });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/courses - Create course
router.post('/', async (req, res, next) => {
  try {
    const {
      title,
      category,
      subtitle,
      badge,
      headerClass,
      subjects,
      features,
      baseFee,
      order,
      isActive
    } = req.body;

    if (!title || !category || !subtitle) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and subtitle are required fields.'
      });
    }

    const validCategories = ['school', 'science', 'competitive'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${validCategories.join(', ')}`
      });
    }

    const newCourse = new Course({
      title: String(title).trim(),
      category,
      subtitle: String(subtitle).trim(),
      badge: badge ? String(badge).trim() : '',
      headerClass: headerClass || 'course-header-school',
      subjects: Array.isArray(subjects) ? subjects.filter(Boolean).map(s => String(s).trim()) : [],
      features: Array.isArray(features) ? features.filter(Boolean).map(f => String(f).trim()) : [],
      baseFee: typeof baseFee === 'number' ? Math.max(0, baseFee) : (parseInt(baseFee, 10) || 35000),
      order: typeof order === 'number' ? order : (parseInt(order, 10) || 0),
      isActive: isActive !== false
    });

    const saved = await newCourse.save();
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: saved
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/courses/:id - Update course
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Course ID format' });
    }

    const allowedUpdates = [
      'title', 'category', 'subtitle', 'badge', 'headerClass',
      'subjects', 'features', 'baseFee', 'order', 'isActive'
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        if (key === 'category') {
          const validCategories = ['school', 'science', 'competitive'];
          if (!validCategories.includes(req.body[key])) {
            return res.status(400).json({
              success: false,
              message: `Category must be one of: ${validCategories.join(', ')}`
            });
          }
          updates[key] = req.body[key];
        } else if (key === 'subjects' || key === 'features') {
          updates[key] = Array.isArray(req.body[key]) ? req.body[key].filter(Boolean).map(s => String(s).trim()) : [];
        } else if (key === 'baseFee' || key === 'order') {
          updates[key] = Number(req.body[key]) || 0;
        } else {
          updates[key] = req.body[key];
        }
      }
    }

    const updated = await Course.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/courses/:id/toggle-status - Toggle course active status
router.patch('/:id/toggle-status', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Course ID format' });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course.isActive = !course.isActive;
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course marked as ${course.isActive ? 'Active' : 'Inactive'}`,
      data: course
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/courses/:id - Delete course
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Course ID format' });
    }

    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
