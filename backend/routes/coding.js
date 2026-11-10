/**
 * Coding Challenge Routes
 * Handles coding challenges, submissions, and AI reviews
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { CodingChallenge, UserSolution } = require('../models');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * Validation rules for code submission
 */
const codeSubmissionValidation = [
  body('challenge_id')
    .isInt({ min: 1 })
    .withMessage('Challenge ID must be a positive integer'),
  body('language')
    .isIn(['python', 'javascript', 'java', 'cpp', 'c'])
    .withMessage('Language must be one of: python, javascript, java, cpp, c'),
  body('code')
    .isLength({ min: 1, max: 10000 })
    .withMessage('Code must be between 1 and 10000 characters')
];

/**
 * GET /api/coding/challenges
 * Get all coding challenges
 */
router.get('/challenges', asyncHandler(async (req, res) => {
  const { difficulty, limit = 10, offset = 0 } = req.query;

  try {
    const query = { is_active: true };
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const challenges = await CodingChallenge.find(query)
      .sort({ created_at: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const total = await CodingChallenge.countDocuments(query);

    res.json({
      challenges: challenges.map(challenge => ({
        id: challenge._id,
        title: challenge.title,
        subtitle: challenge.subtitle,
        difficulty: challenge.difficulty,
        description: challenge.description,
        tags: challenge.tags,
        estimated_time: challenge.estimated_time,
        success_rate: challenge.success_rate,
        total_attempts: challenge.total_attempts
      })),
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get coding challenges error:', error);
    res.status(500).json({
      error: 'Failed to get coding challenges',
      message: 'Internal server error'
    });
  }
}));

/**
 * GET /api/coding/challenges/:challengeId
 * Get specific coding challenge details
 */
router.get('/challenges/:challengeId', asyncHandler(async (req, res) => {
  const { challengeId } = req.params;

  try {
    const challenge = await CodingChallenge.findOne({
      _id: parseInt(challengeId),
      is_active: true
    });

    if (!challenge) {
      return res.status(404).json({
        error: 'Challenge not found',
        message: 'Coding challenge does not exist or is not active'
      });
    }

    res.json({
      challenge: {
        id: challenge._id,
        title: challenge.title,
        subtitle: challenge.subtitle,
        difficulty: challenge.difficulty,
        description: challenge.description,
        examples: challenge.examples,
        constraints: challenge.constraints,
        solution_template: challenge.solution_template,
        test_cases: challenge.getParsedTestCases(),
        tags: challenge.tags,
        estimated_time: challenge.estimated_time,
        success_rate: challenge.success_rate,
        total_attempts: challenge.total_attempts,
        created_at: challenge.created_at
      }
    });

  } catch (error) {
    console.error('Get coding challenge error:', error);
    res.status(500).json({
      error: 'Failed to get coding challenge',
      message: 'Internal server error'
    });
  }
}));

/**
 * POST /api/coding/submit
 * Submit code solution for a challenge
 */
router.post('/submit', codeSubmissionValidation, asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please check your input',
      details: errors.array()
    });
  }

  const { challenge_id, language, code } = req.body;
  const userId = 'demo-user'; // Demo user for non-authenticated access

  try {
    // Check if challenge exists
    const challenge = await CodingChallenge.findOne({
      _id: challenge_id,
      is_active: true
    });

    if (!challenge) {
      return res.status(404).json({
        error: 'Challenge not found',
        message: 'Coding challenge does not exist or is not active'
      });
    }

    // Execute code and get results (simplified implementation)
    const executionResult = await executeCode(code, language, challenge.getParsedTestCases());

    // Create user solution record
    const userSolution = new UserSolution({
      user_id: userId,
      challenge_id,
      language,
      code,
      status: executionResult.status,
      execution_time: executionResult.execution_time,
      memory_usage: executionResult.memory_usage,
      test_results: JSON.stringify(executionResult.test_results),
      error_message: executionResult.error_message,
      test_cases_passed: executionResult.test_cases_passed,
      total_test_cases: executionResult.total_test_cases,
      created_at: new Date()
    });

    await userSolution.save();

    // Update challenge statistics
    challenge.incrementAttempts(executionResult.status === 'success');
    await challenge.save();

    // Generate AI feedback if successful
    let aiFeedback = null;
    if (executionResult.status === 'success') {
      aiFeedback = await generateAIFeedback(code, language, challenge);
      if (aiFeedback) {
        userSolution.addAIFeedback(aiFeedback);
        await userSolution.save();
      }
    }

    res.json({
      message: 'Code submitted successfully',
      result: {
        id: userSolution._id,
        status: userSolution.status,
        score: userSolution.score,
        test_cases_passed: userSolution.test_cases_passed,
        total_test_cases: userSolution.total_test_cases,
        execution_time: userSolution.execution_time,
        memory_usage: userSolution.memory_usage,
        test_results: userSolution.getParsedTestResults(),
        error_message: userSolution.error_message,
        ai_feedback: aiFeedback,
        created_at: userSolution.created_at
      }
    });

  } catch (error) {
    console.error('Code submission error:', error);
    res.status(500).json({
      error: 'Failed to submit code',
      message: 'Internal server error'
    });
  }
}));

/**
 * GET /api/coding/solutions
 * Get user's coding solutions
 */
router.get('/solutions', asyncHandler(async (req, res) => {
  const { challenge_id, limit = 10, offset = 0 } = req.query;
  const userId = 'demo-user'; // Demo user for non-authenticated access

  try {
    const query = { user_id: userId };
    if (challenge_id) {
      query.challenge_id = parseInt(challenge_id);
    }

    const solutions = await UserSolution.find(query)
      .sort({ created_at: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const total = await UserSolution.countDocuments(query);

    res.json({
      solutions: solutions.map(solution => ({
        id: solution._id,
        challenge_id: solution.challenge_id,
        language: solution.language,
        status: solution.status,
        score: solution.score,
        test_cases_passed: solution.test_cases_passed,
        total_test_cases: solution.total_test_cases,
        execution_time: solution.execution_time,
        created_at: solution.created_at
      })),
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get coding solutions error:', error);
    res.status(500).json({
      error: 'Failed to get coding solutions',
      message: 'Internal server error'
    });
  }
}));

/**
 * GET /api/coding/solutions/:solutionId
 * Get specific coding solution details
 */
router.get('/solutions/:solutionId', asyncHandler(async (req, res) => {
  const { solutionId } = req.params;
  const userId = 'demo-user'; // Demo user for non-authenticated access

  try {
    const solution = await UserSolution.findOne({
      _id: solutionId,
      user_id: userId
    });

    if (!solution) {
      return res.status(404).json({
        error: 'Solution not found',
        message: 'Coding solution does not exist or you do not have access to it'
      });
    }

    res.json({
      solution: {
        id: solution._id,
        challenge_id: solution.challenge_id,
        language: solution.language,
        code: solution.code,
        status: solution.status,
        score: solution.score,
        test_cases_passed: solution.test_cases_passed,
        total_test_cases: solution.total_test_cases,
        execution_time: solution.execution_time,
        memory_usage: solution.memory_usage,
        test_results: solution.getParsedTestResults(),
        error_message: solution.error_message,
        ai_feedback: solution.ai_feedback,
        is_optimal: solution.is_optimal,
        complexity_analysis: solution.complexity_analysis,
        created_at: solution.created_at
      }
    });

  } catch (error) {
    console.error('Get coding solution error:', error);
    res.status(500).json({
      error: 'Failed to get coding solution',
      message: 'Internal server error'
    });
  }
}));

/**
 * GET /api/coding/stats
 * Get user's coding statistics
 */
router.get('/stats', asyncHandler(async (req, res) => {
  const userId = 'demo-user'; // Demo user for non-authenticated access

  try {
    const stats = await UserSolution.aggregate([
      { $match: { user_id: userId } },
      {
        $group: {
          _id: null,
          total_submissions: { $sum: 1 },
          successful_submissions: {
            $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] }
          },
          average_score: { $avg: '$score' },
          languages_used: { $addToSet: '$language' },
          challenges_attempted: { $addToSet: '$challenge_id' }
        }
      }
    ]);

    const result = stats[0] || {
      total_submissions: 0,
      successful_submissions: 0,
      average_score: 0,
      languages_used: [],
      challenges_attempted: []
    };

    // Calculate success rate
    result.success_rate = result.total_submissions > 0 
      ? Math.round((result.successful_submissions / result.total_submissions) * 100)
      : 0;

    result.total_challenges_attempted = result.challenges_attempted.length;
    result.total_languages_used = result.languages_used.length;

    res.json({
      stats: result
    });

  } catch (error) {
    console.error('Get coding stats error:', error);
    res.status(500).json({
      error: 'Failed to get coding statistics',
      message: 'Internal server error'
    });
  }
}));

// Helper functions

/**
 * Execute code and run test cases (simplified implementation)
 */
async function executeCode(code, language, testCases) {
  // This is a simplified implementation
  // In a real app, this would use a secure code execution environment
  
  const result = {
    status: 'success',
    execution_time: Math.random() * 1000, // Random execution time
    memory_usage: Math.random() * 1024 * 1024, // Random memory usage
    test_results: [],
    test_cases_passed: 0,
    total_test_cases: testCases.length,
    error_message: null
  };

  // Simulate test case execution
  for (let i = 0; i < testCases.length; i++) {
    const passed = Math.random() > 0.3; // 70% chance of passing
    result.test_results.push({
      test_case: i + 1,
      passed,
      expected: testCases[i].expected || 'Expected output',
      actual: passed ? testCases[i].expected || 'Expected output' : 'Wrong output'
    });
    
    if (passed) {
      result.test_cases_passed++;
    }
  }

  // Simulate compilation/runtime errors
  if (Math.random() < 0.1) { // 10% chance of error
    result.status = 'error';
    result.error_message = 'Compilation error: Syntax error in code';
    result.test_cases_passed = 0;
  }

  return result;
}

/**
 * Generate AI feedback for successful solutions
 */
async function generateAIFeedback(code, language, challenge) {
  // This is a simplified implementation
  // In a real app, this would use AI services like Gemini or OpenAI
  
  const feedbackTemplates = [
    'Great solution! Your code is clean and efficient.',
    'Good approach! Consider optimizing the time complexity.',
    'Well done! The logic is correct and easy to understand.',
    'Nice work! You could improve readability with better variable names.',
    'Excellent! This is an optimal solution for the problem.'
  ];

  return feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)];
}

module.exports = router;
