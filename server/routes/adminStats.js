const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Achiever = require('../models/Achiever');
const Testimonial = require('../models/Testimonial');
const QuizQuestion = require('../models/QuizQuestion');
const Enrollment = require('../models/Enrollment');
const Inquiry = require('../models/Inquiry');
const QuizAttempt = require('../models/QuizAttempt');
const { requireAdmin } = require('../middleware/requireAdmin');

router.use(requireAdmin);

// GET /api/admin/stats - Comprehensive dashboard overview statistics
router.get('/', async (req, res, next) => {
  try {
    const [
      totalCourses,
      activeCourses,
      totalAchievers,
      activeAchievers,
      totalTestimonials,
      approvedTestimonials,
      totalQuestions,
      totalEnrollments,
      pendingEnrollments,
      totalInquiries,
      newInquiries,
      totalAttempts,
      recentEnrollments,
      recentInquiries
    ] = await Promise.all([
      Course.countDocuments().catch(() => 0),
      Course.countDocuments({ isActive: true }).catch(() => 0),
      Achiever.countDocuments().catch(() => 0),
      Achiever.countDocuments({ isActive: { $ne: false } }).catch(() => 0),
      Testimonial.countDocuments().catch(() => 0),
      Testimonial.countDocuments({ isApproved: { $ne: false } }).catch(() => 0),
      QuizQuestion.countDocuments().catch(() => 0),
      Enrollment.countDocuments().catch(() => 0),
      Enrollment.countDocuments({ status: 'Pending' }).catch(() => 0),
      Inquiry.countDocuments().catch(() => 0),
      Inquiry.countDocuments({ status: 'New' }).catch(() => 0),
      QuizAttempt.countDocuments().catch(() => 0),
      Enrollment.find().sort({ createdAt: -1 }).limit(5).catch(() => []),
      Inquiry.find().sort({ createdAt: -1 }).limit(5).catch(() => [])
    ]);

    res.status(200).json({
      success: true,
      data: {
        courses: {
          total: totalCourses,
          active: activeCourses,
          inactive: totalCourses - activeCourses
        },
        achievers: {
          total: totalAchievers,
          active: activeAchievers
        },
        testimonials: {
          total: totalTestimonials,
          approved: approvedTestimonials,
          pending: totalTestimonials - approvedTestimonials
        },
        quiz: {
          questionsCount: totalQuestions,
          totalAttempts: totalAttempts
        },
        enrollments: {
          total: totalEnrollments,
          pending: pendingEnrollments
        },
        inquiries: {
          total: totalInquiries,
          new: newInquiries
        },
        recentEnrollments,
        recentInquiries
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
