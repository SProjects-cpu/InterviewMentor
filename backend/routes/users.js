/**
 * User Routes
 * Handles user profile management and user-related operations
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { User, ProfileDetails } = require('../models');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * Validation rules for profile update
 */
const profileValidation = [
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('graduation_year')
    .optional()
    .isLength({ min: 4, max: 4 })
    .isNumeric()
    .withMessage('Graduation year must be a 4-digit number')
];

/**
 * GET /api/users/profile
 * Get current user's profile details (demo mode)
 */
router.get('/profile', asyncHandler(async (req, res) => {
  try {
    const userId = 'demo-user';
    const user = await User.findById(userId);
    if (!user) {
      // Return demo user data if not found in database
      return res.json({
        user: {
          id: 'demo-user',
          username: 'DemoUser',
          email: 'demo@interviewmentor.com',
          created_at: new Date()
        }
      });
    }

    const profile = await ProfileDetails.findOne({ user_id: userId });

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      created_at: user.created_at
    };

    if (profile) {
      userData.phone = profile.phone;
      userData.location = profile.location;
      userData.institution = profile.institution;
      userData.degree = profile.degree;
      userData.graduation_year = profile.graduation_year;
      userData.skills = profile.skills;
      userData.profile_picture = profile.profile_picture;
      userData.updated_at = profile.updated_at;
    }

    res.json({
      user: userData
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: 'Internal server error'
    });
  }
}));

/**
 * PUT /api/users/profile
 * Update current user's profile details (demo mode)
 */
router.put('/profile', profileValidation, asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please check your input',
      details: errors.array()
    });
  }

  try {
    const userId = 'demo-user';
    const {
      phone,
      location,
      institution,
      degree,
      graduation_year,
      skills,
      profile_picture,
      email
    } = req.body;

    // Update user email if provided (demo mode)
    if (email) {
      const user = await User.findById(userId);
      if (user) {
        user.email = email;
        await user.save();
      }
    }

    // Update or create profile details
    const profileData = {
      user_id: userId,
      phone,
      location,
      institution,
      degree,
      graduation_year,
      skills,
      profile_picture,
      updated_at: new Date()
    };

    // Remove undefined values
    Object.keys(profileData).forEach(key => {
      if (profileData[key] === undefined) {
        delete profileData[key];
      }
    });

    const profile = await ProfileDetails.findOneAndUpdate(
      { user_id: userId },
      profileData,
      { upsert: true, new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      profile: profile
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Update failed',
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      error: 'Failed to update profile',
      message: 'Internal server error'
    });
  }
}));

/**
 * GET /api/users/:userId/profile
 * Get specific user's profile (public information only)
 */
router.get('/:userId/profile', asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    const profile = await ProfileDetails.findOne({ user_id: userId });

    // Return only public information
    const publicData = {
      id: user._id,
      username: user.username,
      created_at: user.created_at
    };

    if (profile) {
      publicData.location = profile.location;
      publicData.institution = profile.institution;
      publicData.degree = profile.degree;
      publicData.graduation_year = profile.graduation_year;
      publicData.skills = profile.skills;
      publicData.profile_picture = profile.profile_picture;
    }

    res.json({
      user: publicData
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      error: 'Failed to get user profile',
      message: 'Internal server error'
    });
  }
}));

/**
 * DELETE /api/users/account
 * Delete current user's account (demo mode - no actual deletion)
 */
router.delete('/account', asyncHandler(async (req, res) => {
  try {
    // In demo mode, just return success without actually deleting
    res.json({
      message: 'Account deletion simulated successfully (Demo Mode)',
      note: 'No actual data was removed in demo mode'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      error: 'Failed to delete account',
      message: 'Internal server error'
    });
  }
}));

/**
 * GET /api/users/stats
 * Get current user's statistics (demo mode)
 */
router.get('/stats', asyncHandler(async (req, res) => {
  try {
    const userId = 'demo-user';

    // Get quiz statistics
    const { QuizResult } = require('../models');
    const quizStats = await QuizResult.aggregate([
      { $match: { user_id: userId } },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          averageScore: { $avg: '$score' },
          bestScore: { $max: '$score' },
          totalQuestions: { $sum: '$total_questions' }
        }
      }
    ]);

    // Get coding challenge statistics
    const { UserSolution } = require('../models');
    const codingStats = await UserSolution.aggregate([
      { $match: { user_id: userId } },
      {
        $group: {
          _id: null,
          totalSolutions: { $sum: 1 },
          successfulSolutions: {
            $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] }
          },
          averageScore: { $avg: '$score' }
        }
      }
    ]);

    // Get career guidance count
    const { CareerGuidance } = require('../models');
    const careerCount = await CareerGuidance.countDocuments({ user_id: userId });

    const stats = {
      quiz: quizStats[0] || {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        totalQuestions: 0
      },
      coding: codingStats[0] || {
        totalSolutions: 0,
        successfulSolutions: 0,
        averageScore: 0
      },
      career: {
        totalAssessments: careerCount
      }
    };

    // Calculate success rate for coding
    if (stats.coding.totalSolutions > 0) {
      stats.coding.successRate = Math.round(
        (stats.coding.successfulSolutions / stats.coding.totalSolutions) * 100
      );
    } else {
      stats.coding.successRate = 0;
    }

    res.json({
      stats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      error: 'Failed to get user statistics',
      message: 'Internal server error'
    });
  }
}));

module.exports = router;
