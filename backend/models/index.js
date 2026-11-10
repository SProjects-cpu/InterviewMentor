/**
 * Models Index - Export all Mongoose models
 * Centralized export for all database models
 */

const User = require('./User');
const QuizResult = require('./QuizResult');
const CareerGuidance = require('./CareerGuidance');
const ProfileDetails = require('./ProfileDetails');
const CodingChallenge = require('./CodingChallenge');
const UserSolution = require('./UserSolution');
// const Resume = require('./Resume'); // Disabled - Resume builder functionality removed

module.exports = {
  User,
  QuizResult,
  CareerGuidance,
  ProfileDetails,
  CodingChallenge,
  UserSolution
  // Resume // Disabled - Resume builder functionality removed
};
