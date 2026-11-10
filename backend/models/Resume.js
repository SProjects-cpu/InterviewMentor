// Resume model disabled - Resume builder functionality removed
// This model is no longer used

const mongoose = require('mongoose');

// Placeholder schema for removed resume functionality
const resumeSchema = new mongoose.Schema({
  disabled: {
    type: Boolean,
    default: true
  },
  message: {
    type: String,
    default: 'Resume builder functionality has been removed'
  }
}, {
  timestamps: true
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
