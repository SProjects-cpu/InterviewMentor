/**
 * Career Guidance Routes
 * Handles career assessment and guidance features
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { CareerGuidance } = require('../models');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * Validation rules for career guidance submission
 */
const careerGuidanceValidation = [
  body('interests')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Interests must be less than 500 characters'),
  body('academic_score')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Academic score must be between 0 and 100'),
  body('future_aspirations')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Future aspirations must be less than 1000 characters'),
  body('skills')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Skills must be less than 500 characters')
];

/**
 * POST /api/career/assessment
 * Submit career assessment data
 */
router.post('/assessment', careerGuidanceValidation, asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please check your input',
      details: errors.array()
    });
  }

  const {
    interests,
    academic_score,
    future_aspirations,
    skills,
    assessment_type = 'initial'
  } = req.body;

  const userId = 'demo-user'; // Demo user for non-authenticated access

  try {
    // Generate AI recommendations (simplified for now)
    const recommendations = await generateCareerRecommendations({
      interests,
      academic_score,
      future_aspirations,
      skills
    });

    // Create career guidance record
    const careerGuidance = new CareerGuidance({
      user_id: userId,
      interests,
      academic_score,
      future_aspirations,
      skills,
      recommendations: JSON.stringify(recommendations),
      assessment_type,
      completion_status: 'completed',
      timestamp: new Date()
    });

    await careerGuidance.save();

    res.json({
      message: 'Career assessment submitted successfully',
      assessment: {
        id: careerGuidance._id,
        recommendations,
        timestamp: careerGuidance.timestamp
      }
    });

  } catch (error) {
    console.error('Career assessment error:', error);
    res.status(500).json({
      error: 'Failed to submit career assessment',
      message: 'Internal server error'
    });
  }
}));

/**
 * GET /api/career/assessments
 * Get user's career assessments
 */
router.get('/assessments', asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const userId = 'demo-user'; // Demo user for non-authenticated access

  try {
    const assessments = await CareerGuidance.find({ user_id: userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      assessments: assessments.map(assessment => ({
        id: assessment._id,
        interests: assessment.interests,
        academic_score: assessment.academic_score,
        future_aspirations: assessment.future_aspirations,
        skills: assessment.skills,
        recommendations: assessment.getParsedRecommendations(),
        assessment_type: assessment.assessment_type,
        completion_status: assessment.completion_status,
        timestamp: assessment.timestamp
      }))
    });

  } catch (error) {
    console.error('Get career assessments error:', error);
    res.status(500).json({
      error: 'Failed to get career assessments',
      message: 'Internal server error'
    });
  }
}));

/**
 * GET /api/career/assessments/:assessmentId
 * Get specific career assessment details
 */
router.get('/assessments/:assessmentId', asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;
  const userId = 'demo-user'; // Demo user for non-authenticated access

  try {
    const assessment = await CareerGuidance.findOne({
      _id: assessmentId,
      user_id: userId
    });

    if (!assessment) {
      return res.status(404).json({
        error: 'Assessment not found',
        message: 'Career assessment does not exist or you do not have access to it'
      });
    }

    res.json({
      assessment: {
        id: assessment._id,
        interests: assessment.interests,
        academic_score: assessment.academic_score,
        future_aspirations: assessment.future_aspirations,
        skills: assessment.skills,
        recommendations: assessment.getParsedRecommendations(),
        assessment_type: assessment.assessment_type,
        completion_status: assessment.completion_status,
        career_paths: assessment.career_paths,
        strengths: assessment.strengths,
        areas_for_improvement: assessment.areas_for_improvement,
        timestamp: assessment.timestamp
      }
    });

  } catch (error) {
    console.error('Get career assessment error:', error);
    res.status(500).json({
      error: 'Failed to get career assessment',
      message: 'Internal server error'
    });
  }
}));

/**
 * GET /api/career/latest
 * Get user's latest career assessment
 */
router.get('/latest', asyncHandler(async (req, res) => {
  const userId = 'demo-user'; // Demo user for non-authenticated access

  try {
    const latestAssessment = await CareerGuidance.findOne({ user_id: userId })
      .sort({ timestamp: -1 });

    if (!latestAssessment) {
      return res.status(404).json({
        error: 'No assessment found',
        message: 'No career assessments found for this user'
      });
    }

    res.json({
      assessment: {
        id: latestAssessment._id,
        interests: latestAssessment.interests,
        academic_score: latestAssessment.academic_score,
        future_aspirations: latestAssessment.future_aspirations,
        skills: latestAssessment.skills,
        recommendations: latestAssessment.getParsedRecommendations(),
        assessment_type: latestAssessment.assessment_type,
        completion_status: latestAssessment.completion_status,
        career_paths: latestAssessment.career_paths,
        strengths: latestAssessment.strengths,
        areas_for_improvement: latestAssessment.areas_for_improvement,
        timestamp: latestAssessment.timestamp
      }
    });

  } catch (error) {
    console.error('Get latest career assessment error:', error);
    res.status(500).json({
      error: 'Failed to get latest career assessment',
      message: 'Internal server error'
    });
  }
}));

/**
 * PUT /api/career/assessments/:assessmentId
 * Update career assessment
 */
router.put('/assessments/:assessmentId', careerGuidanceValidation, asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please check your input',
      details: errors.array()
    });
  }

  const { assessmentId } = req.params;
  const userId = 'demo-user'; // Demo user for non-authenticated access
  const updateData = req.body;

  try {
    const assessment = await CareerGuidance.findOne({
      _id: assessmentId,
      user_id: userId
    });

    if (!assessment) {
      return res.status(404).json({
        error: 'Assessment not found',
        message: 'Career assessment does not exist or you do not have access to it'
      });
    }

    // Update assessment data
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        assessment[key] = updateData[key];
      }
    });

    // Regenerate recommendations if assessment data changed
    if (updateData.interests || updateData.academic_score || updateData.future_aspirations || updateData.skills) {
      const recommendations = await generateCareerRecommendations({
        interests: assessment.interests,
        academic_score: assessment.academic_score,
        future_aspirations: assessment.future_aspirations,
        skills: assessment.skills
      });
      assessment.recommendations = JSON.stringify(recommendations);
    }

    assessment.timestamp = new Date();
    await assessment.save();

    res.json({
      message: 'Career assessment updated successfully',
      assessment: {
        id: assessment._id,
        recommendations: assessment.getParsedRecommendations(),
        timestamp: assessment.timestamp
      }
    });

  } catch (error) {
    console.error('Update career assessment error:', error);
    res.status(500).json({
      error: 'Failed to update career assessment',
      message: 'Internal server error'
    });
  }
}));

/**
 * DELETE /api/career/assessments/:assessmentId
 * Delete career assessment
 */
router.delete('/assessments/:assessmentId', asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;
  const userId = 'demo-user'; // Demo user for non-authenticated access

  try {
    const assessment = await CareerGuidance.findOneAndDelete({
      _id: assessmentId,
      user_id: userId
    });

    if (!assessment) {
      return res.status(404).json({
        error: 'Assessment not found',
        message: 'Career assessment does not exist or you do not have access to it'
      });
    }

    res.json({
      message: 'Career assessment deleted successfully'
    });

  } catch (error) {
    console.error('Delete career assessment error:', error);
    res.status(500).json({
      error: 'Failed to delete career assessment',
      message: 'Internal server error'
    });
  }
}));

// Helper functions

/**
 * Generate career recommendations based on assessment data
 */
async function generateCareerRecommendations(assessmentData) {
  // This is a simplified implementation
  // In a real app, this would use AI/ML models or external APIs
  
  const { interests, academic_score, future_aspirations, skills } = assessmentData;
  
  const recommendations = {
    career_paths: [],
    strengths: [],
    areas_for_improvement: [],
    next_steps: [],
    confidence_score: 0
  };

  // Simple rule-based recommendations
  if (interests && interests.toLowerCase().includes('technology')) {
    recommendations.career_paths.push('Software Development', 'Data Science', 'Cybersecurity');
  }
  
  if (interests && interests.toLowerCase().includes('business')) {
    recommendations.career_paths.push('Business Analysis', 'Project Management', 'Consulting');
  }
  
  if (academic_score >= 80) {
    recommendations.strengths.push('Strong academic performance');
    recommendations.confidence_score += 20;
  }
  
  if (skills && skills.toLowerCase().includes('programming')) {
    recommendations.strengths.push('Technical skills');
    recommendations.career_paths.push('Full Stack Development', 'DevOps Engineer');
    recommendations.confidence_score += 25;
  }
  
  if (academic_score < 70) {
    recommendations.areas_for_improvement.push('Academic performance');
    recommendations.next_steps.push('Focus on improving grades');
  }
  
  // Default recommendations
  if (recommendations.career_paths.length === 0) {
    recommendations.career_paths.push('General Management', 'Sales', 'Customer Service');
  }
  
  recommendations.next_steps.push('Take relevant online courses', 'Build a portfolio', 'Network with professionals');
  recommendations.confidence_score = Math.min(recommendations.confidence_score, 100);
  
  return recommendations;
}

module.exports = router;
