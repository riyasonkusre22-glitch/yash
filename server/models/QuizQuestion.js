const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: [v => Array.isArray(v) && v.length >= 2, 'Must have at least 2 options']
  },
  correct: {
    type: Number,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
