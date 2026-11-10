/**
 * User Model - Mongoose Schema
 * Equivalent to users collection in MongoDB
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    description: 'User ID (same as username for compatibility)'
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
    description: 'Unique username'
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    description: 'Hashed password'
  },
  email: {
    type: String,
    default: null,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email'],
    description: 'User email address'
  },
  created_at: {
    type: Date,
    default: Date.now,
    description: 'Account creation timestamp'
  }
}, {
  collection: 'users',
  versionKey: false,
  _id: false // We're using custom _id
});

// Indexes
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { sparse: true });
userSchema.index({ created_at: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Static method to find user by username
userSchema.statics.findByUsername = function(username) {
  return this.findOne({ username });
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Transform output to match Flask API format
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  
  // Remove password from output
  delete userObject.password;
  
  return userObject;
};

// Virtual for user ID (for compatibility)
userSchema.virtual('id').get(function() {
  return this._id;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
