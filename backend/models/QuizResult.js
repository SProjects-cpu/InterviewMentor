/**
 * QuizResult Model - Mongoose Schema
 * Equivalent to quizResults collection in MongoDB
 */

const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    ref: 'User',
    description: 'Reference to user ID'
  },
  test_id: {
    type: String,
    default: null,
    description: 'Test identifier'
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    description: 'Quiz score'
  },
  total_questions: {
    type: Number,
    required: true,
    min: 1,
    description: 'Total number of questions'
  },
  answers: {
    type: String,
    default: null,
    description: 'JSON string of user answers'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    description: 'Quiz completion timestamp'
  },
  // Additional fields for enhanced functionality
  test_type: {
    type: String,
    description: 'Type of test (arithmetic, vocabulary, etc.)'
  },
  time_taken: {
    type: Number,
    description: 'Time taken to complete the quiz in seconds'
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100,
    description: 'Percentage score'
  }
}, {
  collection: 'quizResults',
  versionKey: false
});

// Indexes
quizResultSchema.index({ user_id: 1 });
quizResultSchema.index({ test_id: 1 });
quizResultSchema.index({ timestamp: -1 });
quizResultSchema.index({ user_id: 1, timestamp: -1 });

// Pre-save middleware to calculate percentage
quizResultSchema.pre('save', function(next) {
  if (this.score !== undefined && this.total_questions !== undefined) {
    this.percentage = Math.round((this.score / this.total_questions) * 100);
  }
  next();
});

// Static method to get user's quiz results
quizResultSchema.statics.findByUserId = function(userId, limit = 10) {
  return this.find({ user_id: userId })
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Static method to get quiz results by test type
quizResultSchema.statics.findByTestType = function(testType, limit = 10) {
  return this.find({ test_type: testType })
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Static method to get user's best score for a test type
quizResultSchema.statics.getBestScore = function(userId, testType) {
  return this.findOne({ 
    user_id: userId, 
    test_type: testType 
  }).sort({ score: -1 });
};

// Instance method to get parsed answers
quizResultSchema.methods.getParsedAnswers = function() {
  try {
    return this.answers ? JSON.parse(this.answers) : null;
  } catch (error) {
    return null;
  }
};

// Virtual for formatted timestamp
quizResultSchema.virtual('formatted_timestamp').get(function() {
  return this.timestamp.toISOString();
});

// Transform output to match Flask API format
quizResultSchema.methods.toJSON = function() {
  const resultObject = this.toObject();
  
  // Add virtual fields
  resultObject.formatted_timestamp = this.formatted_timestamp;
  
  return resultObject;
};

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = QuizResult;
