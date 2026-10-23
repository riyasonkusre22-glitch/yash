const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  parentPhone: {
    type: String,
    required: [true, 'Parent phone number is required'],
    trim: true
  },
  classPreference: {
    type: String,
    trim: true
  },
  preferredTime: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Contacted', 'Resolved'],
    default: 'New',
    index: true
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
