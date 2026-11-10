/**
 * ProfileDetails Model - Mongoose Schema
 * Equivalent to profileDetails collection in MongoDB
 */

const mongoose = require('mongoose');

const profileDetailsSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
    ref: 'User',
    description: 'Reference to user ID (primary key)'
  },
  phone: {
    type: String,
    default: null,
    description: 'Phone number'
  },
  location: {
    type: String,
    default: null,
    description: 'User location'
  },
  institution: {
    type: String,
    default: null,
    description: 'Educational institution'
  },
  degree: {
    type: String,
    default: null,
    description: 'Degree/qualification'
  },
  graduation_year: {
    type: String,
    default: null,
    description: 'Graduation year'
  },
  skills: {
    type: String,
    default: null,
    description: 'User skills'
  },
  profile_picture: {
    type: String,
    default: null,
    description: 'Profile picture URL/path'
  },
  updated_at: {
    type: Date,
    default: Date.now,
    description: 'Profile last updated timestamp'
  },
  // Additional fields for enhanced functionality
  bio: {
    type: String,
    maxlength: 500,
    description: 'User biography'
  },
  linkedin_url: {
    type: String,
    description: 'LinkedIn profile URL'
  },
  github_url: {
    type: String,
    description: 'GitHub profile URL'
  },
  portfolio_url: {
    type: String,
    description: 'Portfolio website URL'
  },
  experience_level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner',
    description: 'Experience level'
  },
  preferred_job_types: {
    type: [String],
    default: [],
    description: 'Preferred job types'
  },
  certifications: {
    type: [String],
    default: [],
    description: 'Professional certifications'
  }
}, {
  collection: 'profileDetails',
  versionKey: false
});

// Indexes
profileDetailsSchema.index({ user_id: 1 }, { unique: true });

// Pre-save middleware to update timestamp
profileDetailsSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Static method to find profile by user ID
profileDetailsSchema.statics.findByUserId = function(userId) {
  return this.findOne({ user_id: userId });
};

// Static method to create or update profile
profileDetailsSchema.statics.upsertProfile = function(userId, profileData) {
  return this.findOneAndUpdate(
    { user_id: userId },
    { ...profileData, user_id: userId, updated_at: new Date() },
    { upsert: true, new: true, runValidators: true }
  );
};

// Instance method to get parsed skills
profileDetailsSchema.methods.getParsedSkills = function() {
  try {
    return this.skills ? this.skills.split(',').map(skill => skill.trim()) : [];
  } catch (error) {
    return [];
  }
};

// Instance method to add skill
profileDetailsSchema.methods.addSkill = function(skill) {
  const skills = this.getParsedSkills();
  if (!skills.includes(skill)) {
    skills.push(skill);
    this.skills = skills.join(', ');
  }
};

// Instance method to add certification
profileDetailsSchema.methods.addCertification = function(certification) {
  if (!this.certifications.includes(certification)) {
    this.certifications.push(certification);
  }
};

// Instance method to add preferred job type
profileDetailsSchema.methods.addPreferredJobType = function(jobType) {
  if (!this.preferred_job_types.includes(jobType)) {
    this.preferred_job_types.push(jobType);
  }
};

// Virtual for full name (if we add first_name and last_name later)
profileDetailsSchema.virtual('display_name').get(function() {
  return this.user_id; // For now, use user_id as display name
});

// Virtual for formatted updated timestamp
profileDetailsSchema.virtual('formatted_updated_at').get(function() {
  return this.updated_at.toISOString();
});

// Transform output to match Flask API format
profileDetailsSchema.methods.toJSON = function() {
  const profileObject = this.toObject();
  
  // Add virtual fields
  profileObject.display_name = this.display_name;
  profileObject.formatted_updated_at = this.formatted_updated_at;
  
  return profileObject;
};

const ProfileDetails = mongoose.model('ProfileDetails', profileDetailsSchema);

module.exports = ProfileDetails;
