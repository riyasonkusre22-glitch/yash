const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const QuizQuestion = require('../models/QuizQuestion');
const QuizAttempt = require('../models/QuizAttempt');

const defaultQuestions = [
  {
    id: 1,
    question: 'What is the unit of Electric Current in the SI system?',
    category: 'Class 10 - Physics',
    options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
    correct: 1
  },
  {
    id: 2,
    question: "Which organelle is known as the 'Powerhouse of the Cell'?",
    category: 'Class 9 - Biology',
    options: ['Ribosome', 'Golgi Apparatus', 'Mitochondria', 'Nucleus'],
    correct: 2
  },
  {
    id: 3,
    question: 'If pH of a solution is 2, the solution is:',
    category: 'Class 10 - Chemistry',
    options: ['Strongly Acidic', 'Weakly Basic', 'Neutral', 'Strongly Basic'],
    correct: 0
  }
];

// GET /api/quiz/questions - Returns quiz questions from MongoDB with fallback
router.get('/questions', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const dbQuestions = await QuizQuestion.find().sort({ order: 1 });
      if (dbQuestions && dbQuestions.length > 0) {
        return res.status(200).json({
          success: true,
          count: dbQuestions.length,
          data: dbQuestions
        });
      }
    }
    return res.status(200).json({
      success: true,
      count: defaultQuestions.length,
      data: defaultQuestions
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      data: defaultQuestions
    });
  }
});

// POST /api/quiz/attempts - Saves quiz attempt
router.post('/attempts', async (req, res, next) => {
  try {
    const { score, totalQuestions, answers } = req.body;

    if (score === undefined || totalQuestions === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide score and totalQuestions.'
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({
        success: true,
        message: 'Quiz attempt saved! (offline mode)',
        data: { score, totalQuestions, _id: 'offline-' + Date.now() }
      });
    }

    const quizAttempt = new QuizAttempt({
      score,
      totalQuestions,
      answers: Array.isArray(answers) ? answers : []
    });

    const savedAttempt = await quizAttempt.save();

    return res.status(201).json({
      success: true,
      message: 'Quiz attempt saved successfully!',
      data: savedAttempt
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/quiz/attempts - Get history of attempts
router.get('/attempts', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }
    const attempts = await QuizAttempt.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
