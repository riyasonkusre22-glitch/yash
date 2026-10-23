const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const QuizQuestion = require('../models/QuizQuestion');
const { requireAdmin, requireCsrf } = require('../middleware/requireAdmin');

router.use(requireAdmin);
router.use(requireCsrf);

// GET /api/admin/quiz/questions
router.get('/questions', async (req, res, next) => {
  try {
    const questions = await QuizQuestion.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/quiz/questions
router.post('/questions', async (req, res, next) => {
  try {
    const { question, category, options, correct, explanation, order } = req.body;

    if (!question || !category || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Question text, category, and at least 2 options are required.'
      });
    }

    const correctIndex = Number(correct);
    if (isNaN(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
      return res.status(400).json({
        success: false,
        message: `Correct answer index must be between 0 and ${options.length - 1}`
      });
    }

    const cleanOptions = options.map(opt => String(opt).trim()).filter(Boolean);
    if (cleanOptions.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Options must not be empty.'
      });
    }

    const newQuestion = new QuizQuestion({
      question: String(question).trim(),
      category: String(category).trim(),
      options: cleanOptions,
      correct: correctIndex,
      explanation: explanation ? String(explanation).trim() : '',
      order: typeof order === 'number' ? order : 0
    });

    const saved = await newQuestion.save();
    res.status(201).json({
      success: true,
      message: 'Quiz question created successfully',
      data: saved
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/quiz/questions/:id
router.patch('/questions/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const current = await QuizQuestion.findById(id);
    if (!current) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const allowed = ['question', 'category', 'options', 'correct', 'explanation', 'order'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (updates.options) {
      if (!Array.isArray(updates.options) || updates.options.length < 2) {
        return res.status(400).json({ success: false, message: 'Must provide at least 2 options' });
      }
      updates.options = updates.options.map(opt => String(opt).trim()).filter(Boolean);
    }

    const targetOptions = updates.options || current.options;
    if (updates.correct !== undefined) {
      const c = Number(updates.correct);
      if (isNaN(c) || c < 0 || c >= targetOptions.length) {
        return res.status(400).json({
          success: false,
          message: `Correct index must reference a valid option (0 to ${targetOptions.length - 1})`
        });
      }
      updates.correct = c;
    }

    const updated = await QuizQuestion.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    res.status(200).json({
      success: true,
      message: 'Quiz question updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/quiz/questions/:id
router.delete('/questions/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const deleted = await QuizQuestion.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Quiz question deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
