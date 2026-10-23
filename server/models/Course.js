const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['school', 'science', 'competitive'],
    index: true
  },
  subtitle: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    default: ''
  },
  headerClass: {
    type: String,
    default: 'course-header-school'
  },
  subjects: {
    type: [String],
    default: []
  },
  features: {
    type: [String],
    default: []
  },
  baseFee: {
    type: Number,
    default: 35000
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
