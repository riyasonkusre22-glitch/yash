const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionIndex: {
    type: Number,
    required: true
  },
  selectedAnswer: {
    type: Number,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
}, { _id: false });

const quizAttemptSchema = new mongoose.Schema({
  score: {
    type: Number,
    required: [true, 'Score is required']
  },
  totalQuestions: {
    type: Number,
    required: [true, 'Total questions is required']
  },
  answers: {
    type: [answerSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
