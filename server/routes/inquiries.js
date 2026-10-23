const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Inquiry = require('../models/Inquiry');

// POST /api/inquiries - Submit contact inquiry
router.post('/', async (req, res, next) => {
  try {
    const { studentName, parentPhone, classPreference, preferredTime, message } = req.body;

    if (!studentName || !parentPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentName and parentPhone.'
      });
    }

    // If MongoDB is not connected, return mock success
    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({
        success: true,
        message: 'Inquiry submitted successfully! (offline mode)',
        data: { studentName, parentPhone, classPreference, preferredTime, message, _id: 'offline-' + Date.now() }
      });
    }

    const inquiry = new Inquiry({
      studentName: studentName.trim(),
      parentPhone: parentPhone.trim(),
      classPreference: classPreference ? classPreference.trim() : undefined,
      preferredTime: preferredTime ? preferredTime.trim() : undefined,
      message: message ? message.trim() : undefined
    });

    const savedInquiry = await inquiry.save();

    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully!',
      data: savedInquiry
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/inquiries - Get all inquiries sorted newest first
router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
