/**
 * CodingChallenge Model - Mongoose Schema
 * Equivalent to codingChallenges collection in MongoDB
 */

const mongoose = require('mongoose');

const codingChallengeSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    description: 'Challenge ID'
  },
  title: {
    type: String,
    required: true,
    description: 'Challenge title'
  },
  subtitle: {
    type: String,
    required: true,
    description: 'Challenge subtitle'
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
    description: 'Challenge difficulty level'
  },
  description: {
    type: String,
    required: true,
    description: 'Challenge description'
  },
  examples: {
    type: String,
    required: true,
    description: 'Challenge examples'
  },
  constraints: {
    type: String,
    required: true,
    description: 'Challenge constraints'
  },
  solution_template: {
    type: String,
    required: true,
    description: 'Solution template code'
  },
  test_cases: {
    type: String,
    required: true,
    description: 'JSON string of test cases'
  },
  created_at: {
    type: Date,
    default: Date.now,
    description: 'Challenge creation timestamp'
  },
  // Additional fields for enhanced functionality
  tags: {
    type: [String],
    default: [],
    description: 'Challenge tags/categories'
  },
  estimated_time: {
    type: Number,
    description: 'Estimated time to solve in minutes'
  },
  success_rate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    description: 'Success rate percentage'
  },
  total_attempts: {
    type: Number,
    default: 0,
    description: 'Total number of attempts'
  },
  successful_attempts: {
    type: Number,
    default: 0,
    description: 'Number of successful attempts'
  },
  author: {
    type: String,
    description: 'Challenge author'
  },
  is_active: {
    type: Boolean,
    default: true,
    description: 'Whether challenge is active'
  }
}, {
  collection: 'codingChallenges',
  versionKey: false,
  _id: false // We're using custom _id
});

// Indexes
codingChallengeSchema.index({ difficulty: 1 });
codingChallengeSchema.index({ created_at: -1 });
codingChallengeSchema.index({ title: 'text', description: 'text' });
codingChallengeSchema.index({ tags: 1 });
codingChallengeSchema.index({ is_active: 1 });

// Static method to find by difficulty
codingChallengeSchema.statics.findByDifficulty = function(difficulty) {
  return this.find({ difficulty, is_active: true }).sort({ created_at: -1 });
};

// Static method to find by tags
codingChallengeSchema.statics.findByTags = function(tags) {
  return this.find({ tags: { $in: tags }, is_active: true }).sort({ created_at: -1 });
};

// Static method to get random challenge
codingChallengeSchema.statics.getRandomChallenge = function(difficulty = null) {
  const query = { is_active: true };
  if (difficulty) {
    query.difficulty = difficulty;
  }
  return this.aggregate([
    { $match: query },
    { $sample: { size: 1 } }
  ]);
};

// Instance method to get parsed test cases
codingChallengeSchema.methods.getParsedTestCases = function() {
  try {
    return this.test_cases ? JSON.parse(this.test_cases) : [];
  } catch (error) {
    return [];
  }
};

// Instance method to get parsed examples
codingChallengeSchema.methods.getParsedExamples = function() {
  try {
    return this.examples ? JSON.parse(this.examples) : [];
  } catch (error) {
    return this.examples;
  }
};

// Instance method to increment attempts
codingChallengeSchema.methods.incrementAttempts = function(isSuccessful = false) {
  this.total_attempts += 1;
  if (isSuccessful) {
    this.successful_attempts += 1;
  }
  this.success_rate = this.total_attempts > 0 
    ? Math.round((this.successful_attempts / this.total_attempts) * 100) 
    : 0;
};

// Instance method to add tag
codingChallengeSchema.methods.addTag = function(tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
  }
};

// Virtual for ID (for compatibility)
codingChallengeSchema.virtual('id').get(function() {
  return this._id;
});

// Virtual for formatted timestamp
codingChallengeSchema.virtual('formatted_created_at').get(function() {
  return this.created_at.toISOString();
});

// Ensure virtual fields are serialized
codingChallengeSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    return ret;
  }
});

const CodingChallenge = mongoose.model('CodingChallenge', codingChallengeSchema);

module.exports = CodingChallenge;
