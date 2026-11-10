import { gql } from '@apollo/client';

// User Queries
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      username
      email
      created_at
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    profile {
      id
      user_id
      full_name
      email
      phone
      address
      bio
      skills
      experience
      education
      certifications
      profile_picture
      created_at
      updated_at
    }
  }
`;

// Aptitude Test Queries
export const GET_APTITUDE_CATEGORIES = gql`
  query GetAptitudeCategories {
    aptitudeCategories {
      id
      name
      description
      question_count
      time_limit
    }
  }
`;

export const GET_QUIZ_RESULTS = gql`
  query GetQuizResults($limit: Int, $offset: Int) {
    quizResults(limit: $limit, offset: $offset) {
      _id
      user_id
      test_type
      category
      score
      total_questions
      correct_answers
      time_taken
      completed_at
      created_at
    }
  }
`;

export const GET_USER_QUIZ_RESULTS = gql`
  query GetUserQuizResults($userId: String!) {
    userQuizResults(userId: $userId) {
      _id
      user_id
      test_type
      category
      score
      total_questions
      correct_answers
      time_taken
      completed_at
      created_at
    }
  }
`;

// Coding Challenge Queries
export const GET_CODING_CHALLENGES = gql`
  query GetCodingChallenges {
    codingChallenges {
      _id
      title
      description
      difficulty
      category
      input_format
      output_format
      constraints
      sample_input
      sample_output
      test_cases
      created_at
    }
  }
`;

export const GET_CODING_CHALLENGE = gql`
  query GetCodingChallenge($id: String!) {
    codingChallenge(id: $id) {
      _id
      title
      description
      difficulty
      category
      input_format
      output_format
      constraints
      sample_input
      sample_output
      test_cases
      created_at
    }
  }
`;

export const GET_USER_SOLUTIONS = gql`
  query GetUserSolutions($limit: Int, $offset: Int) {
    userSolutions(limit: $limit, offset: $offset) {
      _id
      user_id
      challenge_id
      language
      code
      status
      score
      test_cases_passed
      total_test_cases
      execution_time
      created_at
    }
  }
`;

// Career Guidance Queries
export const GET_CAREER_GUIDANCE = gql`
  query GetCareerGuidance {
    careerGuidance {
      _id
      user_id
      interests
      skills
      experience_level
      preferred_industries
      career_goals
      assessment_results
      recommendations
      created_at
      updated_at
    }
  }
`;

export const GET_USER_CAREER_GUIDANCE = gql`
  query GetUserCareerGuidance($userId: String!) {
    userCareerGuidance(userId: $userId) {
      _id
      user_id
      interests
      skills
      experience_level
      preferred_industries
      career_goals
      assessment_results
      recommendations
      created_at
      updated_at
    }
  }
`;
