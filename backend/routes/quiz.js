/**
 * Quiz Routes
 * Handles aptitude test categories, questions, and results
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { QuizResult } = require('../models');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Import question modules (we'll need to create these as Node.js modules)
// For now, we'll use static data that matches the Flask API structure

/**
 * Static data for aptitude categories (matching Flask API)
 */
const APTITUDE_CATEGORIES = [
  {
    id: 'logical',
    name: 'Logical Reasoning',
    icon: 'brain',
    description: 'Test your logical thinking and problem-solving abilities.',
    color: '#4CAF50'
  },
  {
    id: 'verbal',
    name: 'Verbal Ability',
    icon: 'comment-alt',
    description: 'Assess your language skills, vocabulary, and comprehension.',
    color: '#2196F3'
  },
  {
    id: 'quantitative',
    name: 'Quantitative Aptitude',
    icon: 'calculator',
    description: 'Evaluate your mathematical and numerical reasoning skills.',
    color: '#FF9800'
  },
  {
    id: 'technical',
    name: 'Technical Knowledge',
    icon: 'code',
    description: 'Test your understanding of technical concepts and programming.',
    color: '#9C27B0'
  }
];

/**
 * Static data for category tests (matching Flask API)
 */
const CATEGORY_TESTS = {
  logical: {
    id: 'logical',
    name: 'Logical Reasoning',
    tests: [
      {
        id: 'logical_deduction',
        name: 'Deductive Reasoning',
        description: 'Apply logical rules to solve complex problems.',
        questions: 10,
        time: 5,
        difficulty: 'Hard'
      },
      {
        id: 'logical_puzzles',
        name: 'Logical Puzzles',
        description: 'Solve puzzles that test your logical thinking.',
        questions: 10,
        time: 5,
        difficulty: 'Medium'
      }
    ]
  },
  verbal: {
    id: 'verbal',
    name: 'Verbal Ability',
    tests: [
      {
        id: 'verbal_vocabulary',
        name: 'Vocabulary',
        description: 'Test your knowledge of synonyms, antonyms, and word meanings.',
        questions: 10,
        time: 5,
        difficulty: 'Medium'
      },
      {
        id: 'verbal_comprehension',
        name: 'Reading Comprehension',
        description: 'Assess your ability to understand and analyze written text.',
        questions: 10,
        time: 5,
        difficulty: 'Medium'
      },
      {
        id: 'verbal_grammar',
        name: 'Grammar',
        description: 'Test your understanding of English grammar rules.',
        questions: 10,
        time: 5,
        difficulty: 'Easy'
      }
    ]
  },
  quantitative: {
    id: 'quantitative',
    name: 'Quantitative Aptitude',
    tests: [
      {
        id: 'quant_arithmetic',
        name: 'Arithmetic',
        description: 'Test your skills in basic arithmetic operations and calculations.',
        questions: 20,
        time: 20,
        difficulty: 'Medium'
      }
    ]
  },
  technical: {
    id: 'technical',
    name: 'Technical Knowledge',
    tests: [
      {
        id: 'tech_programming',
        name: 'Programming Concepts',
        description: 'Test your knowledge of programming fundamentals.',
        questions: 10,
        time: 10,
        difficulty: 'Medium'
      },
      {
        id: 'tech_algorithms',
        name: 'Algorithms & Data Structures',
        description: 'Assess your understanding of algorithms and data structures.',
        questions: 10,
        time: 10,
        difficulty: 'Hard'
      },
      {
        id: 'tech_web',
        name: 'Web Technologies',
        description: 'Test your knowledge of web development technologies.',
        questions: 10,
        time: 10,
        difficulty: 'Medium'
      }
    ]
  }
};

/**
 * GET /api/quiz/aptitude/categories
 * Get all aptitude test categories
 */
router.get('/aptitude/categories', asyncHandler(async (req, res) => {
  res.json({
    categories: APTITUDE_CATEGORIES
  });
}));

/**
 * GET /api/quiz/aptitude/categories/:categoryId
 * Get tests for a specific category
 */
router.get('/aptitude/categories/:categoryId', asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  if (!CATEGORY_TESTS[categoryId]) {
    return res.status(404).json({
      error: 'Category not found',
      message: `Category '${categoryId}' does not exist`
    });
  }

  res.json({
    category: CATEGORY_TESTS[categoryId]
  });
}));

/**
 * GET /api/quiz/test/:testId/questions
 * Get questions for a specific test
 */
router.get('/test/:testId/questions', asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const { limit = 10 } = req.query;

  // For now, return sample questions
  // In a real implementation, this would fetch from question modules
  const sampleQuestions = generateSampleQuestions(testId, parseInt(limit));

  if (!sampleQuestions) {
    return res.status(404).json({
      error: 'Test not found',
      message: `Test '${testId}' does not exist`
    });
  }

  res.json({
    test_id: testId,
    questions: sampleQuestions,
    total_questions: sampleQuestions.length,
    time_limit: getTimeLimit(testId)
  });
}));

/**
 * POST /api/quiz/submit
 * Submit quiz answers and get results
 */
router.post('/submit', [
  body('test_id').notEmpty().withMessage('Test ID is required'),
  body('answers').isArray().withMessage('Answers must be an array'),
  body('time_taken').optional().isNumeric().withMessage('Time taken must be a number')
], asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please check your input',
      details: errors.array()
    });
  }

  const { test_id, answers, time_taken } = req.body;
  const userId = 'demo-user'; // Demo user for non-authenticated access

  try {
    // Calculate score (simplified scoring logic)
    const { score, totalQuestions } = calculateScore(test_id, answers);
    const percentage = Math.round((score / totalQuestions) * 100);

    // Save quiz result
    const quizResult = new QuizResult({
      user_id: userId,
      test_id,
      test_type: getTestType(test_id),
      score,
      total_questions: totalQuestions,
      percentage,
      time_taken: time_taken || null,
      answers: JSON.stringify(answers),
      timestamp: new Date()
    });

    await quizResult.save();

    res.json({
      message: 'Quiz submitted successfully',
      result: {
        id: quizResult._id,
        test_id,
        score,
        total_questions: totalQuestions,
        percentage,
        time_taken,
        timestamp: quizResult.timestamp
      }
    });

  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({
      error: 'Failed to submit quiz',
      message: 'Internal server error'
    });
  }
}));

/**
 * GET /api/quiz/results
 * Get user's quiz results
 */
router.get('/results', asyncHandler(async (req, res) => {
  const { limit = 10, test_type } = req.query;
  const userId = 'demo-user'; // Demo user for non-authenticated access

  try {
    const query = { user_id: userId };
    if (test_type) {
      query.test_type = test_type;
    }

    const results = await QuizResult.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      results: results.map(result => ({
        id: result._id,
        test_id: result.test_id,
        test_type: result.test_type,
        score: result.score,
        total_questions: result.total_questions,
        percentage: result.percentage,
        time_taken: result.time_taken,
        timestamp: result.timestamp
      }))
    });

  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({
      error: 'Failed to get quiz results',
      message: 'Internal server error'
    });
  }
}));

/**
 * GET /api/quiz/results/:resultId
 * Get specific quiz result details
 */
router.get('/results/:resultId', asyncHandler(async (req, res) => {
  const { resultId } = req.params;
  const userId = 'demo-user'; // Demo user for non-authenticated access

  try {
    const result = await QuizResult.findOne({
      _id: resultId,
      user_id: userId
    });

    if (!result) {
      return res.status(404).json({
        error: 'Result not found',
        message: 'Quiz result does not exist or you do not have access to it'
      });
    }

    res.json({
      result: {
        id: result._id,
        test_id: result.test_id,
        test_type: result.test_type,
        score: result.score,
        total_questions: result.total_questions,
        percentage: result.percentage,
        time_taken: result.time_taken,
        answers: result.getParsedAnswers(),
        timestamp: result.timestamp
      }
    });

  } catch (error) {
    console.error('Get quiz result error:', error);
    res.status(500).json({
      error: 'Failed to get quiz result',
      message: 'Internal server error'
    });
  }
}));

// Helper functions

/**
 * Generate sample questions for a test
 */
function generateSampleQuestions(testId, limit) {
  // This is a simplified implementation
  // In a real app, this would fetch from actual question modules
  const questions = [];
  
  for (let i = 1; i <= limit; i++) {
    questions.push({
      id: i,
      question: `Sample question ${i} for ${testId}`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct_answer: 0, // Index of correct answer
      explanation: `Explanation for question ${i}`
    });
  }
  
  return questions;
}

/**
 * Get time limit for a test
 */
function getTimeLimit(testId) {
  const timeLimits = {
    'quant_arithmetic': 20,
    'logical_deduction': 5,
    'logical_puzzles': 5,
    'verbal_vocabulary': 5,
    'verbal_comprehension': 5,
    'verbal_grammar': 5,
    'tech_programming': 10,
    'tech_algorithms': 10,
    'tech_web': 10
  };
  
  return timeLimits[testId] || 10;
}

/**
 * Calculate score for submitted answers
 */
function calculateScore(testId, answers) {
  // Simplified scoring - in real implementation, this would check against correct answers
  const totalQuestions = answers.length;
  const score = Math.floor(Math.random() * totalQuestions); // Random score for demo
  
  return { score, totalQuestions };
}

/**
 * Get test type from test ID
 */
function getTestType(testId) {
  if (testId.startsWith('quant_')) return 'quantitative';
  if (testId.startsWith('logical_')) return 'logical';
  if (testId.startsWith('verbal_')) return 'verbal';
  if (testId.startsWith('tech_')) return 'technical';
  return 'general';
}

module.exports = router;
