/**
 * GraphQL Type Definitions
 * Defines the GraphQL schema for Interview Mentor API
 */

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  # User Types
  type User {
    id: String!
    username: String!
    email: String
    created_at: Date!
  }

  type ProfileDetails {
    id: String!
    user_id: String!
    phone: String
    location: String
    institution: String
    degree: String
    graduation_year: String
    skills: String
    profile_picture: String
    updated_at: Date!
  }

  # Quiz Types
  type QuizResult {
    id: String!
    user_id: String!
    test_id: String
    test_type: String
    score: Int!
    total_questions: Int!
    percentage: Int
    time_taken: Int
    answers: String
    timestamp: Date!
  }

  type Question {
    id: Int!
    question: String!
    options: [String!]!
    correct_answer: Int!
    explanation: String
  }

  type TestCategory {
    id: String!
    name: String!
    icon: String!
    description: String!
    color: String!
  }

  type Test {
    id: String!
    name: String!
    description: String!
    questions: Int!
    time: Int!
    difficulty: String!
  }

  # Career Guidance Types
  type CareerGuidance {
    id: String!
    user_id: String!
    interests: String
    academic_score: Int
    future_aspirations: String
    skills: String
    recommendations: String
    assessment_type: String
    completion_status: String
    career_paths: [String!]
    strengths: [String!]
    areas_for_improvement: [String!]
    timestamp: Date!
  }

  # Coding Challenge Types
  type CodingChallenge {
    id: Int!
    title: String!
    subtitle: String!
    difficulty: String!
    description: String!
    examples: String!
    constraints: String!
    solution_template: String!
    test_cases: String!
    tags: [String!]
    estimated_time: Int
    success_rate: Int
    total_attempts: Int
    created_at: Date!
  }

  type UserSolution {
    id: String!
    user_id: String!
    challenge_id: Int!
    language: String!
    code: String!
    status: String!
    score: Int
    test_cases_passed: Int
    total_test_cases: Int
    execution_time: Float
    memory_usage: Float
    test_results: String
    error_message: String
    ai_feedback: String
    is_optimal: Boolean
    created_at: Date!
  }

  # Statistics Types
  type QuizStats {
    total_quizzes: Int!
    average_score: Float!
    best_score: Int!
    total_questions: Int!
  }

  type CodingStats {
    total_submissions: Int!
    successful_submissions: Int!
    success_rate: Int!
    average_score: Float!
    total_challenges_attempted: Int!
    total_languages_used: Int!
    languages_used: [String!]!
  }

  type UserStats {
    quiz: QuizStats!
    coding: CodingStats!
    career_assessments: Int!
  }

  # Input Types
  input UserInput {
    username: String!
    password: String!
    email: String
  }

  input ProfileDetailsInput {
    phone: String
    location: String
    institution: String
    degree: String
    graduation_year: String
    skills: String
    profile_picture: String
  }

  input QuizSubmissionInput {
    test_id: String!
    answers: [String!]!
    time_taken: Int
  }

  input CareerAssessmentInput {
    interests: String
    academic_score: Int
    future_aspirations: String
    skills: String
    assessment_type: String
  }

  input CodeSubmissionInput {
    challenge_id: Int!
    language: String!
    code: String!
  }

  input QuizResultInput {
    test_type: String!
    category: String!
    score: Int!
    total_questions: Int!
    correct_answers: Int!
    time_taken: Int!
    answers: [String]
  }

  input CareerGuidanceInput {
    interests: [String]
    skills: [String]
    experience_level: String
    preferred_industries: [String]
    career_goals: String
    assessment_results: String
  }

  # Response Types
  type AuthResponse {
    message: String!
    token: String
    user: User
  }

  type MutationResponse {
    success: Boolean!
    message: String!
    data: String
  }

  # Queries
  type Query {
    # User queries
    me: User
    user(id: String!): User
    users(limit: Int, offset: Int): [User!]!

    # Profile queries
    profile: ProfileDetails
    userProfile(userId: String!): ProfileDetails

    # Quiz queries
    quizResults(limit: Int, test_type: String): [QuizResult!]!
    quizResult(id: String!): QuizResult
    aptitudeCategories: [TestCategory!]!
    categoryTests(categoryId: String!): [Test!]!
    testQuestions(testId: String!, limit: Int): [Question!]!

    # Career guidance queries
    careerAssessments(limit: Int): [CareerGuidance!]!
    careerAssessment(id: String!): CareerGuidance
    latestCareerAssessment: CareerGuidance

    # Coding challenge queries
    codingChallenges(difficulty: String, limit: Int, offset: Int): [CodingChallenge!]!
    codingChallenge(id: Int!): CodingChallenge
    userSolutions(challengeId: Int, limit: Int, offset: Int): [UserSolution!]!
    userSolution(id: String!): UserSolution

    # Statistics queries
    userStats: UserStats!
  }

  # Mutations
  type Mutation {
    # Authentication mutations - DISABLED
    register(input: UserInput!): AuthResponse!
    login(username: String!, password: String!): AuthResponse!
    logout: MutationResponse!

    # Profile mutations
    updateProfile(input: ProfileDetailsInput!): MutationResponse!

    # Quiz mutations
    submitQuiz(input: QuizSubmissionInput!): MutationResponse!
    saveQuizResult(input: QuizResultInput!): MutationResponse!

    # Career guidance mutations
    submitCareerAssessment(input: CareerAssessmentInput!): MutationResponse!
    saveCareerGuidance(input: CareerGuidanceInput!): MutationResponse!
    updateCareerAssessment(id: String!, input: CareerAssessmentInput!): MutationResponse!
    deleteCareerAssessment(id: String!): MutationResponse!

    # Coding challenge mutations
    submitCode(input: CodeSubmissionInput!): MutationResponse!
  }
`;

module.exports = typeDefs;
