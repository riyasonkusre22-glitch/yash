require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Public route modules
const enrollmentRoutes = require('./routes/enrollments');
const inquiryRoutes = require('./routes/inquiries');
const quizRoutes = require('./routes/quiz');
const courseRoutes = require('./routes/courses');
const achieverRoutes = require('./routes/achievers');
const testimonialRoutes = require('./routes/testimonials');

// Admin route modules
const adminAuthRoutes = require('./routes/adminAuth');
const adminStatsRoutes = require('./routes/adminStats');
const adminCoursesRoutes = require('./routes/adminCourses');
const adminAchieversRoutes = require('./routes/adminAchievers');
const adminTestimonialsRoutes = require('./routes/adminTestimonials');
const adminQuizRoutes = require('./routes/adminQuiz');
const adminEnrollmentsRoutes = require('./routes/adminEnrollments');
const adminInquiriesRoutes = require('./routes/adminInquiries');
const adminQuizAttemptsRoutes = require('./routes/adminQuizAttempts');

// Models for public stats
const Enrollment = require('./models/Enrollment');
const Inquiry = require('./models/Inquiry');
const Course = require('./models/Course');
const Achiever = require('./models/Achiever');
const QuizAttempt = require('./models/QuizAttempt');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS Middleware with credentials enabled for secure session cookies
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));

// Body parser
app.use(express.json());

// MongoDB-backed Session Store
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://riyasonkusre22_db_user:3TDUjQkp1B3JtnaP@yash.8lus1h9.mongodb.net/yash_tutorials?retryWrites=true&w=majority';
app.use(session({
  name: 'yt_admin_sid',
  secret: process.env.SESSION_SECRET || 'yash-tutorials-secure-production-session-key-4f46e5-312e81',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoUri,
    collectionName: 'admin_sessions',
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Mount Public API routes
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/achievers', achieverRoutes);
app.use('/api/testimonials', testimonialRoutes);

// Mount Protected Admin API routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/stats', adminStatsRoutes);
app.use('/api/admin/courses', adminCoursesRoutes);
app.use('/api/admin/achievers', adminAchieversRoutes);
app.use('/api/admin/testimonials', adminTestimonialsRoutes);
app.use('/api/admin/quiz', adminQuizRoutes);
app.use('/api/admin/enrollments', adminEnrollmentsRoutes);
app.use('/api/admin/inquiries', adminInquiriesRoutes);
app.use('/api/admin/quiz/attempts', adminQuizAttemptsRoutes);

// Public Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const [enrollments, inquiries, courses, achievers, quizAttempts] = await Promise.all([
      Enrollment.countDocuments().catch(() => 0),
      Inquiry.countDocuments().catch(() => 0),
      Course.countDocuments({ isActive: true }).catch(() => 0),
      Achiever.countDocuments({ isActive: { $ne: false } }).catch(() => 0),
      QuizAttempt.countDocuments().catch(() => 0)
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEnrollments: enrollments,
        totalInquiries: inquiries,
        totalCourses: courses,
        totalAchievers: achievers,
        totalQuizAttempts: quizAttempts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Yash Tutorials API is operational',
    database: 'MongoDB Atlas Connected'
  });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err.message || err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Yash Tutorials Server running on http://localhost:${PORT}`);
});

module.exports = app;
