const mongoose = require('mongoose');

const achieverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  initials: {
    type: String,
    required: true,
    trim: true
  },
  achievement: {
    type: String,
    required: true,
    trim: true
  },
  batch: {
    type: String,
    default: '2025',
    trim: true
  },
  quote: {
    type: String,
    required: true,
    trim: true
  },
  bgColor: {
    type: String,
    default: '#c7d2fe'
  },
  textColor: {
    type: String,
    default: '#3730a3'
  },
  badgeVariant: {
    type: String,
    default: 'badge-amber'
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
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

module.exports = mongoose.model('Achiever', achieverSchema);
