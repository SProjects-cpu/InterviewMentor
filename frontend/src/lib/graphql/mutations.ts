import { gql } from '@apollo/client';

// Authentication mutations have been removed
// These are kept as dummy exports for compatibility
export const REGISTER_USER = gql`
  query DummyQuery {
    __typename
  }
`;

export const LOGIN_USER = gql`
  query DummyQuery {
    __typename
  }
`;

// Profile Mutations
export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: ProfileDetailsInput!) {
    updateProfile(input: $input) {
      success
      message
      data
    }
  }
`;

// Quiz Result Mutations
export const SAVE_QUIZ_RESULT = gql`
  mutation SaveQuizResult($input: QuizResultInput!) {
    saveQuizResult(input: $input) {
      success
      message
      data
    }
  }
`;

// Career Guidance Mutations
export const SAVE_CAREER_GUIDANCE = gql`
  mutation SaveCareerGuidance($input: CareerGuidanceInput!) {
    saveCareerGuidance(input: $input) {
      success
      message
      data
    }
  }
`;

// Coding Challenge Mutations
export const SUBMIT_CODE = gql`
  mutation SubmitCode($input: UserSolutionInput!) {
    submitCode(input: $input) {
      success
      message
      data
    }
  }
`;

// Input Types (for TypeScript)
export interface UserInput {
  username: string;
  password: string;
  email?: string;
}

export interface ProfileDetailsInput {
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  certifications?: string[];
  profile_picture?: string;
}

export interface QuizResultInput {
  test_type: string;
  category: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_taken: number;
  answers?: any[];
}

export interface CareerGuidanceInput {
  interests?: string[];
  skills?: string[];
  experience_level?: string;
  preferred_industries?: string[];
  career_goals?: string;
  assessment_results?: any;
}

export interface UserSolutionInput {
  challenge_id: string;
  language: string;
  code: string;
}
