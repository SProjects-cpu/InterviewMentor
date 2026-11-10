import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import {
  GET_CURRENT_USER,
  GET_USER_PROFILE,
  GET_APTITUDE_CATEGORIES,
  GET_QUIZ_RESULTS,
  GET_USER_QUIZ_RESULTS,
  GET_CODING_CHALLENGES,
  GET_CODING_CHALLENGE,
  GET_USER_SOLUTIONS,
  GET_CAREER_GUIDANCE,
  GET_USER_CAREER_GUIDANCE,
} from './queries';
import {
  REGISTER_USER,
  LOGIN_USER,
  UPDATE_PROFILE,
  SAVE_QUIZ_RESULT,
  SAVE_CAREER_GUIDANCE,
  SUBMIT_CODE,
  UserInput,
  ProfileDetailsInput,
  QuizResultInput,
  CareerGuidanceInput,
  UserSolutionInput,
} from './mutations';

// Create a simple Apollo Client for API calls (no authentication)
function createSimpleApolloClient() {
  if (typeof window === 'undefined') {
    // For SSR, return a minimal client that won't be used
    return null;
  }

  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:5000/graphql',
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      });
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  return new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
  });
}

// Authentication API has been removed
export const authGraphQL = {
  register: async (userData: UserInput) => {
    throw new Error('Authentication has been disabled');
  },

  login: async (username: string, password: string) => {
    throw new Error('Authentication has been disabled');
  },

  getCurrentUser: async () => {
    const apolloClient = createSimpleApolloClient();
    if (!apolloClient) throw new Error('Apollo client not available');
    const { data } = await apolloClient.query({
      query: GET_CURRENT_USER,
      fetchPolicy: 'cache-first',
    });
    return { user: data.currentUser };
  },
};



// Profile API using GraphQL
export const profileGraphQL = {
  getProfile: async () => {
    const apolloClient = createSimpleApolloClient();
    if (!apolloClient) throw new Error('Apollo client not available');
    const { data } = await apolloClient.query({
      query: GET_USER_PROFILE,
      fetchPolicy: 'cache-first',
    });
    return { profile: data.profile };
  },

  updateProfile: async (profileData: ProfileDetailsInput) => {
    const apolloClient = createSimpleApolloClient();
    if (!apolloClient) throw new Error('Apollo client not available');
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_PROFILE,
      variables: { input: profileData },
      refetchQueries: [{ query: GET_USER_PROFILE }],
    });
    return data.updateProfile;
  },

  uploadProfilePicture: async (file: File) => {
    // For now, we'll use the REST endpoint for file upload
    // GraphQL file upload can be implemented later if needed
    const formData = new FormData();
    formData.append('profile_picture', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/profile/picture`, {
      method: 'POST',
      body: formData,
    });

    return await response.json();
  },
};

// Aptitude Test API using REST endpoints (matching Flask API)
export const aptitudeGraphQL = {
  getCategories: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/aptitude/categories`);
    return await response.json();
  },

  getCategoryTests: async (categoryId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/aptitude/categories/${categoryId}`);
    return await response.json();
  },

  startTest: async (testId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/aptitude/test/${testId}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  },

  getQuestion: async (sessionId: string, questionIndex: number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/aptitude/test/${sessionId}/question/${questionIndex}`);
    return await response.json();
  },

  submitAnswer: async (sessionId: string, questionIndex: number, answer: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/aptitude/test/${sessionId}/question/${questionIndex}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answer }),
    });
    return await response.json();
  },

  getResults: async (sessionId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/aptitude/test/${sessionId}/results`);
    return await response.json();
  },
};

// Coding Test API using REST endpoints (matching Flask API)
export const codingGraphQL = {
  getChallenges: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/coding/challenges`);
    return await response.json();
  },

  getChallenge: async (challengeId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/coding/challenges/${challengeId}`);
    return await response.json();
  },

  executeCode: async (code: string, language: string, challengeId?: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/coding/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language, challenge_id: challengeId }),
    });
    return await response.json();
  },

  submitCode: async (challengeId: string, language: string, code: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/coding/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ challenge_id: challengeId, language, code }),
    });
    return await response.json();
  },
};

// Career Guidance API using GraphQL with REST fallback
export const careerGraphQL = {
  getGuidance: async () => {
    try {
      const apolloClient = createSimpleApolloClient();
      if (!apolloClient) throw new Error('Apollo client not available');
      const { data } = await apolloClient.query({
        query: GET_CAREER_GUIDANCE,
        fetchPolicy: 'cache-first',
      });
      return { guidance: data.careerGuidance };
    } catch (error) {
      // Fallback to REST API
      console.log('GraphQL failed, using REST API for career guidance');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/career/assessments`);
      const result = await response.json();
      return { guidance: result.assessments || [] };
    }
  },

  submitGuidanceForm: async (formData: CareerGuidanceInput) => {
    try {
      const apolloClient = createSimpleApolloClient();
      if (!apolloClient) throw new Error('Apollo client not available');
      const { data } = await apolloClient.mutate({
        mutation: SAVE_CAREER_GUIDANCE,
        variables: { input: formData },
        refetchQueries: [{ query: GET_CAREER_GUIDANCE }],
      });
      return data.saveCareerGuidance;
    } catch (error) {
      // Fallback to REST API
      console.log('GraphQL failed, using REST API for career guidance submission');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/career/assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      return await response.json();
    }
  },

  getLatestAssessment: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/career/latest`);
    return await response.json();
  },
};

// Resume Builder API (keeping REST for now)
export const resumeGraphQL = {
  getResume: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/resume`);
    return await response.json();
  },

  saveResume: async (resumeData: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resumeData),
    });
    return await response.json();
  },

  generatePDF: async (resumeData: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/resume/pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resumeData),
    });
    return await response.blob();
  },
};
