const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Enrollment = require('../models/Enrollment');

// POST /api/enrollments - Book demo class
router.post('/', async (req, res, next) => {
  try {
    const { studentName, phone, course } = req.body;

    if (!studentName || !phone || !course) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentName, phone, and course.'
      });
    }

    // If MongoDB is not connected, return mock success
    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({
        success: true,
        message: 'Demo class booked successfully! (offline mode)',
        data: { studentName, phone, course, _id: 'offline-' + Date.now() }
      });
    }

    const enrollment = new Enrollment({
      studentName: studentName.trim(),
      phone: phone.trim(),
      course: course.trim()
    });

    const savedEnrollment = await enrollment.save();

    return res.status(201).json({
      success: true,
      message: 'Demo class booked successfully!',
      data: savedEnrollment
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/enrollments - Get all enrollments sorted newest first
router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }
    const enrollments = await Enrollment.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
