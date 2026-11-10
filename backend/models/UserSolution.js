/**
 * UserSolution Model - Mongoose Schema
 * Equivalent to userSolutions collection in MongoDB
 */

const mongoose = require('mongoose');

const userSolutionSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    ref: 'User',
    description: 'Reference to user ID'
  },
  challenge_id: {
    type: Number,
    required: true,
    ref: 'CodingChallenge',
    description: 'Reference to challenge ID'
  },
  language: {
    type: String,
    required: true,
    description: 'Programming language'
  },
  code: {
    type: String,
    required: true,
    description: 'User\'s solution code'
  },
  status: {
    type: String,
    required: true,
    enum: ['success', 'error', 'timeout'],
    description: 'Execution status'
  },
  execution_time: {
    type: Number,
    default: null,
    description: 'Code execution time in milliseconds'
  },
  memory_usage: {
    type: Number,
    default: null,
    description: 'Memory usage in bytes'
  },
  test_results: {
    type: String,
    default: null,
    description: 'JSON string of test case results'
  },
  error_message: {
    type: String,
    default: null,
    description: 'Error message if execution failed'
  },
  created_at: {
    type: Date,
    default: Date.now,
    description: 'Solution submission timestamp'
  },
  // Additional fields for enhanced functionality
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    description: 'Solution score based on test cases passed'
  },
  test_cases_passed: {
    type: Number,
    default: 0,
    description: 'Number of test cases passed'
  },
  total_test_cases: {
    type: Number,
    default: 0,
    description: 'Total number of test cases'
  },
  is_optimal: {
    type: Boolean,
    default: false,
    description: 'Whether solution is considered optimal'
  },
  complexity_analysis: {
    time_complexity: {
      type: String,
      description: 'Time complexity analysis'
    },
    space_complexity: {
      type: String,
      description: 'Space complexity analysis'
    }
  },
  ai_feedback: {
    type: String,
    description: 'AI-generated feedback on the solution'
  },
  submission_count: {
    type: Number,
    default: 1,
    description: 'Number of times user submitted for this challenge'
  }
}, {
  collection: 'userSolutions',
  versionKey: false
});

// Indexes
userSolutionSchema.index({ user_id: 1 });
userSolutionSchema.index({ challenge_id: 1 });
userSolutionSchema.index({ user_id: 1, challenge_id: 1 });
userSolutionSchema.index({ created_at: -1 });
userSolutionSchema.index({ language: 1 });
userSolutionSchema.index({ status: 1 });

// Pre-save middleware to calculate score
userSolutionSchema.pre('save', function(next) {
  if (this.test_cases_passed !== undefined && this.total_test_cases !== undefined && this.total_test_cases > 0) {
    this.score = Math.round((this.test_cases_passed / this.total_test_cases) * 100);
  }
  next();
});

// Static method to find user's solutions
userSolutionSchema.statics.findByUserId = function(userId, limit = 10) {
  return this.find({ user_id: userId })
    .sort({ created_at: -1 })
    .limit(limit);
};

// Static method to find solutions for a challenge
userSolutionSchema.statics.findByChallengeId = function(challengeId, limit = 10) {
  return this.find({ challenge_id: challengeId })
    .sort({ created_at: -1 })
    .limit(limit);
};

// Static method to find user's best solution for a challenge
userSolutionSchema.statics.getBestSolution = function(userId, challengeId) {
  return this.findOne({ 
    user_id: userId, 
    challenge_id: challengeId 
  }).sort({ score: -1, created_at: -1 });
};

// Static method to get user's successful solutions
userSolutionSchema.statics.getSuccessfulSolutions = function(userId) {
  return this.find({ 
    user_id: userId, 
    status: 'success' 
  }).sort({ created_at: -1 });
};

// Instance method to get parsed test results
userSolutionSchema.methods.getParsedTestResults = function() {
  try {
    return this.test_results ? JSON.parse(this.test_results) : [];
  } catch (error) {
    return [];
  }
};

// Instance method to mark as optimal
userSolutionSchema.methods.markAsOptimal = function() {
  this.is_optimal = true;
};

// Instance method to add AI feedback
userSolutionSchema.methods.addAIFeedback = function(feedback) {
  this.ai_feedback = feedback;
};

// Instance method to update test results
userSolutionSchema.methods.updateTestResults = function(results) {
  this.test_results = JSON.stringify(results);
  this.test_cases_passed = results.filter(r => r.passed).length;
  this.total_test_cases = results.length;
  
  // Calculate score
  if (this.total_test_cases > 0) {
    this.score = Math.round((this.test_cases_passed / this.total_test_cases) * 100);
  }
  
  // Update status based on results
  if (this.test_cases_passed === this.total_test_cases) {
    this.status = 'success';
  } else if (this.test_cases_passed === 0) {
    this.status = 'error';
  }
};

// Virtual for formatted timestamp
userSolutionSchema.virtual('formatted_created_at').get(function() {
  return this.created_at.toISOString();
});

// Virtual for success rate
userSolutionSchema.virtual('success_rate').get(function() {
  return this.total_test_cases > 0 
    ? Math.round((this.test_cases_passed / this.total_test_cases) * 100) 
    : 0;
});

// Transform output to match Flask API format
userSolutionSchema.methods.toJSON = function() {
  const solutionObject = this.toObject();
  
  // Add virtual fields
  solutionObject.formatted_created_at = this.formatted_created_at;
  solutionObject.success_rate = this.success_rate;
  
  return solutionObject;
};

const UserSolution = mongoose.model('UserSolution', userSolutionSchema);

module.exports = UserSolution;
