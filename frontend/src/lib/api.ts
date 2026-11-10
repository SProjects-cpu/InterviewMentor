import axios from 'axios';

// Create axios instance with base configuration for REST endpoints
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (auth token removed)
api.interceptors.request.use(
  (config) => {
    // No authentication headers added
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (auth error handling removed)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // No special auth error handling
    return Promise.reject(error);
  }
);

// Auth API - Disabled (authentication removed)
export const authAPI = {
  register: async () => {
    throw new Error('Authentication has been disabled');
  },
  login: async () => {
    throw new Error('Authentication has been disabled');
  },
  logout: async () => {
    throw new Error('Authentication has been disabled');
  },
  getCurrentUser: async () => {
    throw new Error('Authentication has been disabled');
  }
};

// Profile API - Disabled (authentication removed)
export const profileAPI = {
  getProfile: async () => {
    throw new Error('Profile API disabled - authentication removed');
  },
  updateProfile: async () => {
    throw new Error('Profile API disabled - authentication removed');
  }
};

// Aptitude Test API - Using REST for now (authentication disabled)
export const aptitudeAPI = {
  getCategories: async () => {
    const response = await api.get('/api/aptitude/categories');
    return response.data;
  },
  getCategoryTests: async (categoryId: string) => {
    const response = await api.get(`/api/aptitude/categories/${categoryId}`);
    return response.data;
  },
  startTest: async (testId: string) => {
    const response = await api.post(`/api/aptitude/test/${testId}/start`);
    return response.data;
  },
  getQuestion: async (sessionId: string, questionIndex: number) => {
    const response = await api.get(`/api/aptitude/test/${sessionId}/question/${questionIndex}`);
    return response.data;
  },
  submitAnswer: async (sessionId: string, questionIndex: number, answer: string) => {
    const response = await api.post(`/api/aptitude/test/${sessionId}/question/${questionIndex}`, { answer });
    return response.data;
  },
  getResults: async (sessionId: string) => {
    const response = await api.get(`/api/aptitude/test/${sessionId}/results`);
    return response.data;
  }
};

// Coding Test API - Using REST for now (authentication disabled)
export const codingAPI = {
  getChallenges: async () => {
    const response = await api.get('/api/coding/challenges');
    return response.data;
  },
  getChallenge: async (challengeId: string) => {
    const response = await api.get(`/api/coding/challenges/${challengeId}`);
    return response.data;
  },
  executeCode: async (code: string, language: string, challengeId: string) => {
    const response = await api.post('/api/coding/execute', { code, language, challenge_id: challengeId });
    return response.data;
  },
  getUserSolutions: async () => {
    const response = await api.get('/api/coding/solutions');
    return response.data;
  }
};

// Career Guidance API - Disabled (authentication removed)
export const careerAPI = {
  submitAssessment: async () => {
    throw new Error('Career guidance disabled - authentication removed');
  },
  getRecommendations: async () => {
    throw new Error('Career guidance disabled - authentication removed');
  }
};

// Resume Builder API - Disabled (authentication removed)
export const resumeAPI = {
  createResume: async () => {
    throw new Error('Resume builder disabled - authentication removed');
  },
  getResumes: async () => {
    throw new Error('Resume builder disabled - authentication removed');
  },
  updateResume: async () => {
    throw new Error('Resume builder disabled - authentication removed');
  },
  deleteResume: async () => {
    throw new Error('Resume builder disabled - authentication removed');
  }
};

export default api;
