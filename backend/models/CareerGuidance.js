/**
 * CareerGuidance Model - Mongoose Schema
 * Equivalent to careerGuidance collection in MongoDB
 */

const mongoose = require('mongoose');

const careerGuidanceSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    ref: 'User',
    description: 'Reference to user ID'
  },
  interests: {
    type: String,
    default: null,
    description: 'User interests'
  },
  academic_score: {
    type: Number,
    default: null,
    min: 0,
    max: 100,
    description: 'Academic score (0-100)'
  },
  future_aspirations: {
    type: String,
    default: null,
    description: 'Future career aspirations'
  },
  skills: {
    type: String,
    default: null,
    description: 'User skills'
  },
  recommendations: {
    type: String,
    default: null,
    description: 'AI-generated career recommendations'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    description: 'Career guidance creation timestamp'
  },
  // Additional fields for enhanced functionality
  assessment_type: {
    type: String,
    enum: ['initial', 'follow_up', 'detailed'],
    default: 'initial',
    description: 'Type of career assessment'
  },
  completion_status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending',
    description: 'Assessment completion status'
  },
  career_paths: {
    type: [String],
    default: [],
    description: 'Suggested career paths'
  },
  strengths: {
    type: [String],
    default: [],
    description: 'Identified user strengths'
  },
  areas_for_improvement: {
    type: [String],
    default: [],
    description: 'Areas that need improvement'
  }
}, {
  collection: 'careerGuidance',
  versionKey: false
});

// Indexes
careerGuidanceSchema.index({ user_id: 1 });
careerGuidanceSchema.index({ timestamp: -1 });
careerGuidanceSchema.index({ user_id: 1, timestamp: -1 });

// Static method to get user's career guidance records
careerGuidanceSchema.statics.findByUserId = function(userId, limit = 10) {
  return this.find({ user_id: userId })
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Static method to get latest career guidance for user
careerGuidanceSchema.statics.getLatestForUser = function(userId) {
  return this.findOne({ user_id: userId })
    .sort({ timestamp: -1 });
};

// Instance method to get parsed recommendations
careerGuidanceSchema.methods.getParsedRecommendations = function() {
  try {
    return this.recommendations ? JSON.parse(this.recommendations) : null;
  } catch (error) {
    return this.recommendations;
  }
};

// Instance method to add career path
careerGuidanceSchema.methods.addCareerPath = function(path) {
  if (!this.career_paths.includes(path)) {
    this.career_paths.push(path);
  }
};

// Instance method to add strength
careerGuidanceSchema.methods.addStrength = function(strength) {
  if (!this.strengths.includes(strength)) {
    this.strengths.push(strength);
  }
};

// Instance method to mark as completed
careerGuidanceSchema.methods.markCompleted = function() {
  this.completion_status = 'completed';
  this.timestamp = new Date();
};

// Virtual for formatted timestamp
careerGuidanceSchema.virtual('formatted_timestamp').get(function() {
  return this.timestamp.toISOString();
});

// Transform output to match Flask API format
careerGuidanceSchema.methods.toJSON = function() {
  const guidanceObject = this.toObject();
  
  // Add virtual fields
  guidanceObject.formatted_timestamp = this.formatted_timestamp;
  
  return guidanceObject;
};

const CareerGuidance = mongoose.model('CareerGuidance', careerGuidanceSchema);

module.exports = CareerGuidance;
