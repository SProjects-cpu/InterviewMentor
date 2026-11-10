/**
 * GraphQL Resolvers
 * Implements the resolver functions for GraphQL queries and mutations
 */

const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { User, QuizResult, CareerGuidance, ProfileDetails, CodingChallenge, UserSolution } = require('../models');
const { getConnectionStatus } = require('../config/database');
const {
  MemoryUser,
  MemoryProfileDetails,
  MemoryQuizResult,
  MemoryCareerGuidance,
  MemoryUserSolution,
  initializeMemoryDB
} = require('../config/memory-db');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT configuration
const JWT_SECRET_KEY = process.env.JWT_SECRET || 'interview_mentor_jwt_secret_key_2024';

// Authentication helper functions - DISABLED
const hashPassword = async (password) => {
  return null; // Authentication disabled
};

const verifyPassword = async (password, hashedPassword) => {
  return false; // Authentication disabled
};

const generateToken = (userId) => {
  return null; // Authentication disabled
};

const verifyToken = (token) => {
  return null; // Authentication disabled
};

// Custom Date scalar
const DateType = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value); // value from the client
  },
  serialize(value) {
    return value.getTime(); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // ast value is always in string format
    }
    return null;
  },
});

// Helper function to get the appropriate model based on connection status
const getModels = () => {
  const connectionStatus = getConnectionStatus();

  if (connectionStatus.isSimulator) {
    console.log('🧠 Using memory database models');
    return {
      User: MemoryUser,
      ProfileDetails: MemoryProfileDetails,
      QuizResult: MemoryQuizResult,
      CareerGuidance: MemoryCareerGuidance,
      UserSolution: MemoryUserSolution,
      CodingChallenge: CodingChallenge // Use MongoDB model for coding challenges even in memory mode
    };
  } else {
    console.log('🗄️ Using MongoDB models');
    return {
      User,
      ProfileDetails,
      QuizResult,
      CareerGuidance,
      UserSolution,
      CodingChallenge
    };
  }
};

// Demo user for non-authenticated access
const getDemoUser = () => ({
  _id: 'demo-user',
  username: 'DemoUser',
  email: 'demo@interviewmentor.com',
  created_at: new Date()
});

const resolvers = {
  Date: DateType,

  Query: {
    // User queries with authentication
    me: async (parent, args, context) => {
      try {
        const { token } = context;
        if (!token) {
          return getDemoUser(); // Fallback to demo user if no token
        }

        const userId = verifyToken(token);
        if (!userId) {
          return getDemoUser(); // Fallback to demo user if invalid token
        }

        const { User } = getModels();
        const user = await User.findOne({ username: userId });

        if (!user) {
          return getDemoUser(); // Fallback to demo user if user not found
        }

        return {
          _id: user._id,
          username: user.username,
          email: user.email,
          created_at: user.created_at
        };
      } catch (error) {
        console.error('Me query error:', error);
        return getDemoUser(); // Fallback to demo user on error
      }
    },

    user: async (parent, { id }) => {
      const { User } = getModels();
      return await User.findById(id);
    },

    users: async (parent, { limit = 10, offset = 0 }) => {
      const { User } = getModels();
      return await User.find()
        .skip(offset)
        .limit(limit)
        .sort({ created_at: -1 });
    },

    // Profile queries (demo mode)
    profile: async (parent, args, context) => {
      const { ProfileDetails } = getModels();
      return await ProfileDetails.findOne({ user_id: 'demo-user' });
    },

    userProfile: async (parent, { userId }) => {
      const { ProfileDetails } = getModels();
      return await ProfileDetails.findOne({ user_id: userId });
    },

    // Quiz queries (demo mode)
    quizResults: async (parent, { limit = 10, test_type }, context) => {
      const { QuizResult } = getModels();
      const query = { user_id: 'demo-user' };

      if (test_type) {
        query.test_type = test_type;
      }

      return await QuizResult.find(query)
        .sort({ timestamp: -1 })
        .limit(limit);
    },

    quizResult: async (parent, { id }, context) => {
      const { QuizResult } = getModels();
      return await QuizResult.findOne({ _id: id, user_id: 'demo-user' });
    },

    aptitudeCategories: () => {
      return [
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
    },

    categoryTests: (parent, { categoryId }) => {
      const categories = {
        logical: [
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
        ],
        verbal: [
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
          }
        ],
        quantitative: [
          {
            id: 'quant_arithmetic',
            name: 'Arithmetic',
            description: 'Test your skills in basic arithmetic operations and calculations.',
            questions: 20,
            time: 20,
            difficulty: 'Medium'
          }
        ],
        technical: [
          {
            id: 'tech_programming',
            name: 'Programming Concepts',
            description: 'Test your knowledge of programming fundamentals.',
            questions: 10,
            time: 10,
            difficulty: 'Medium'
          }
        ]
      };

      return categories[categoryId] || [];
    },

    testQuestions: (parent, { testId, limit = 10 }) => {
      // Generate sample questions for demo
      const questions = [];
      for (let i = 1; i <= limit; i++) {
        questions.push({
          id: i,
          question: `Sample question ${i} for ${testId}`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct_answer: 0,
          explanation: `Explanation for question ${i}`
        });
      }
      return questions;
    },

    // Career guidance queries (demo mode)
    careerAssessments: async (parent, { limit = 10 }, context) => {
      const { CareerGuidance } = getModels();
      return await CareerGuidance.find({ user_id: 'demo-user' })
        .sort({ timestamp: -1 })
        .limit(limit);
    },

    careerAssessment: async (parent, { id }, context) => {
      const { CareerGuidance } = getModels();
      return await CareerGuidance.findOne({ _id: id, user_id: 'demo-user' });
    },

    latestCareerAssessment: async (parent, args, context) => {
      const { CareerGuidance } = getModels();
      return await CareerGuidance.findOne({ user_id: 'demo-user' })
        .sort({ timestamp: -1 });
    },

    // Coding challenge queries
    codingChallenges: async (parent, { difficulty, limit = 10, offset = 0 }) => {
      const { CodingChallenge } = getModels();
      const query = { is_active: true };
      if (difficulty) {
        query.difficulty = difficulty;
      }

      return await CodingChallenge.find(query)
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(limit);
    },

    codingChallenge: async (parent, { id }) => {
      const { CodingChallenge } = getModels();
      return await CodingChallenge.findOne({ _id: id, is_active: true });
    },

    userSolutions: async (parent, { challengeId, limit = 10, offset = 0 }, context) => {
      const { UserSolution } = getModels();
      const query = { user_id: 'demo-user' };

      if (challengeId) {
        query.challenge_id = challengeId;
      }

      return await UserSolution.find(query)
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(limit);
    },

    userSolution: async (parent, { id }, context) => {
      const { UserSolution } = getModels();
      return await UserSolution.findOne({ _id: id, user_id: 'demo-user' });
    },

    // Statistics queries (demo mode)
    userStats: async (parent, args, context) => {
      const { QuizResult, UserSolution, CareerGuidance } = getModels();
      const userId = 'demo-user';

      // Get quiz statistics
      const quizStats = await QuizResult.aggregate([
        { $match: { user_id: userId } },
        {
          $group: {
            _id: null,
            total_quizzes: { $sum: 1 },
            average_score: { $avg: '$score' },
            best_score: { $max: '$score' },
            total_questions: { $sum: '$total_questions' }
          }
        }
      ]);

      // Get coding statistics
      const codingStats = await UserSolution.aggregate([
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

      // Get career assessments count
      const careerCount = await CareerGuidance.countDocuments({ user_id: userId });

      const quiz = quizStats[0] || {
        total_quizzes: 0,
        average_score: 0,
        best_score: 0,
        total_questions: 0
      };

      const coding = codingStats[0] || {
        total_submissions: 0,
        successful_submissions: 0,
        average_score: 0,
        languages_used: [],
        challenges_attempted: []
      };

      coding.success_rate = coding.total_submissions > 0 
        ? Math.round((coding.successful_submissions / coding.total_submissions) * 100)
        : 0;
      coding.total_challenges_attempted = coding.challenges_attempted ? coding.challenges_attempted.length : 0;
      coding.total_languages_used = coding.languages_used ? coding.languages_used.length : 0;

      return {
        quiz,
        coding,
        career_assessments: careerCount
      };
    }
  },

  Mutation: {
    // Authentication mutations - DISABLED
    register: async (parent, { input }, context) => {
      throw new Error('Authentication has been disabled');
    },

    login: async (parent, { username, password }, context) => {
      throw new Error('Authentication has been disabled');
    },

    logout: async (parent, args, context) => {
      throw new Error('Authentication has been disabled');
    },

    // Profile mutations (demo mode)
    updateProfile: async (parent, { input }, context) => {
      const { ProfileDetails } = getModels();

      const profile = await ProfileDetails.findOneAndUpdate(
        { user_id: 'demo-user' },
        { ...input, user_id: 'demo-user', updated_at: new Date() },
        { upsert: true, new: true, runValidators: true }
      );

      return {
        success: true,
        message: 'Profile updated successfully (Demo Mode)',
        data: JSON.stringify(profile)
      };
    },

    // Quiz mutations (demo mode)
    submitQuiz: async (parent, { input }, context) => {
      const { QuizResult } = getModels();
      const { test_id, answers, time_taken } = input;

      // Calculate score (simplified)
      const score = Math.floor(Math.random() * answers.length);
      const totalQuestions = answers.length;
      const percentage = Math.round((score / totalQuestions) * 100);

      const quizResult = new QuizResult({
        user_id: 'demo-user',
        test_id,
        test_type: test_id.split('_')[0],
        score,
        total_questions: totalQuestions,
        percentage,
        time_taken,
        answers: JSON.stringify(answers),
        timestamp: new Date()
      });

      await quizResult.save();

      return {
        success: true,
        message: 'Quiz submitted successfully (Demo Mode)',
        data: JSON.stringify(quizResult)
      };
    },

    // Career guidance mutations (demo mode)
    submitCareerAssessment: async (parent, { input }, context) => {
      const { CareerGuidance } = getModels();

      const careerGuidance = new CareerGuidance({
        user_id: 'demo-user',
        ...input,
        completion_status: 'completed',
        timestamp: new Date()
      });

      await careerGuidance.save();

      return {
        success: true,
        message: 'Career assessment submitted successfully (Demo Mode)',
        data: JSON.stringify(careerGuidance)
      };
    },

    // Quiz result mutations (demo mode)
    saveQuizResult: async (parent, { input }, context) => {
      const { QuizResult } = getModels();
      const { test_type, category, score, total_questions, correct_answers, time_taken, answers } = input;

      const quizResult = new QuizResult({
        user_id: 'demo-user',
        test_type,
        category,
        score,
        total_questions,
        correct_answers,
        time_taken,
        answers: answers ? JSON.stringify(answers) : null,
        completed_at: new Date(),
        created_at: new Date()
      });

      await quizResult.save();

      return {
        success: true,
        message: 'Quiz result saved successfully (Demo Mode)',
        data: JSON.stringify(quizResult)
      };
    },

    // Career guidance mutations (demo mode)
    saveCareerGuidance: async (parent, { input }, context) => {
      const { CareerGuidance } = getModels();
      const { interests, skills, experience_level, preferred_industries, career_goals, assessment_results } = input;

      const careerGuidance = new CareerGuidance({
        user_id: 'demo-user',
        interests: interests ? JSON.stringify(interests) : null,
        skills: skills ? JSON.stringify(skills) : null,
        experience_level,
        preferred_industries: preferred_industries ? JSON.stringify(preferred_industries) : null,
        career_goals,
        assessment_results,
        created_at: new Date(),
        updated_at: new Date()
      });

      await careerGuidance.save();

      return {
        success: true,
        message: 'Career guidance saved successfully (Demo Mode)',
        data: JSON.stringify(careerGuidance)
      };
    },

    // Coding challenge mutations (demo mode)
    submitCode: async (parent, { input }, context) => {
      const { UserSolution } = getModels();
      const { challenge_id, language, code } = input;

      // Simplified code execution simulation
      const userSolution = new UserSolution({
        user_id: 'demo-user',
        challenge_id,
        language,
        code,
        status: 'success',
        score: Math.floor(Math.random() * 100),
        test_cases_passed: Math.floor(Math.random() * 10),
        total_test_cases: 10,
        execution_time: Math.random() * 1000,
        created_at: new Date()
      });

      await userSolution.save();

      return {
        success: true,
        message: 'Code submitted successfully (Demo Mode)',
        data: JSON.stringify(userSolution)
      };
    }
  }
};

module.exports = resolvers;
