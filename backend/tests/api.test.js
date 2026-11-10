/**
 * API Test Suite
 * Comprehensive tests for Express API endpoints
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const { User, QuizResult, CareerGuidance, ProfileDetails } = require('../models');

// Test database
const MONGODB_TEST_URI = 'mongodb://localhost:27017/interview_mentor_test';

describe('Interview Mentor Express API', () => {
  let authToken;
  let testUserId;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(MONGODB_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Clean up and close database connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up collections before each test
    await User.deleteMany({});
    await QuizResult.deleteMany({});
    await CareerGuidance.deleteMany({});
    await ProfileDetails.deleteMany({});
  });

  describe('Health Check', () => {
    test('GET /api/health should return server status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Authentication', () => {
    test('POST /api/auth/register should create new user', async () => {
      const userData = {
        username: 'testuser',
        password: 'testpass123',
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('username', 'testuser');
      
      authToken = response.body.token;
      testUserId = response.body.user.id;
    });

    test('POST /api/auth/register should reject duplicate username', async () => {
      const userData = {
        username: 'testuser',
        password: 'testpass123',
        email: 'test@example.com'
      };

      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to create duplicate
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });

    test('POST /api/auth/login should authenticate user', async () => {
      // First register a user
      const userData = {
        username: 'testuser',
        password: 'testpass123',
        email: 'test@example.com'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Then login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'testpass123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('username', 'testuser');
    });

    test('POST /api/auth/login should reject invalid credentials', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'wrongpass'
        })
        .expect(401);
    });

    test('GET /api/auth/me should return current user', async () => {
      // Register and login first
      const userData = {
        username: 'testuser',
        password: 'testpass123',
        email: 'test@example.com'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const token = registerResponse.body.token;

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.user).toHaveProperty('username', 'testuser');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });
  });

  describe('Quiz API', () => {
    beforeEach(async () => {
      // Register a user for quiz tests
      const userData = {
        username: 'quizuser',
        password: 'testpass123',
        email: 'quiz@example.com'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      authToken = response.body.token;
      testUserId = response.body.user.id;
    });

    test('GET /api/quiz/aptitude/categories should return categories', async () => {
      const response = await request(app)
        .get('/api/quiz/aptitude/categories')
        .expect(200);

      expect(response.body).toHaveProperty('categories');
      expect(Array.isArray(response.body.categories)).toBe(true);
      expect(response.body.categories.length).toBeGreaterThan(0);
    });

    test('GET /api/quiz/aptitude/categories/:categoryId should return category tests', async () => {
      const response = await request(app)
        .get('/api/quiz/aptitude/categories/logical')
        .expect(200);

      expect(response.body).toHaveProperty('category');
      expect(response.body.category).toHaveProperty('id', 'logical');
      expect(response.body.category).toHaveProperty('tests');
    });

    test('POST /api/quiz/submit should submit quiz results', async () => {
      const quizData = {
        test_id: 'logical_deduction',
        answers: ['A', 'B', 'C', 'A', 'B'],
        time_taken: 300
      };

      const response = await request(app)
        .post('/api/quiz/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send(quizData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Quiz submitted successfully');
      expect(response.body.result).toHaveProperty('test_id', 'logical_deduction');
    });

    test('GET /api/quiz/results should return user quiz results', async () => {
      // First submit a quiz
      const quizData = {
        test_id: 'logical_deduction',
        answers: ['A', 'B', 'C', 'A', 'B'],
        time_taken: 300
      };

      await request(app)
        .post('/api/quiz/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send(quizData)
        .expect(200);

      // Then get results
      const response = await request(app)
        .get('/api/quiz/results')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results.length).toBe(1);
    });
  });

  describe('Career Guidance API', () => {
    beforeEach(async () => {
      // Register a user for career tests
      const userData = {
        username: 'careeruser',
        password: 'testpass123',
        email: 'career@example.com'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      authToken = response.body.token;
      testUserId = response.body.user.id;
    });

    test('POST /api/career/assessment should submit career assessment', async () => {
      const assessmentData = {
        interests: 'Technology, Programming',
        academic_score: 85,
        future_aspirations: 'Software Engineer',
        skills: 'JavaScript, Python, React'
      };

      const response = await request(app)
        .post('/api/career/assessment')
        .set('Authorization', `Bearer ${authToken}`)
        .send(assessmentData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Career assessment submitted successfully');
      expect(response.body.assessment).toHaveProperty('recommendations');
    });

    test('GET /api/career/assessments should return user assessments', async () => {
      // First submit an assessment
      const assessmentData = {
        interests: 'Technology, Programming',
        academic_score: 85,
        future_aspirations: 'Software Engineer',
        skills: 'JavaScript, Python, React'
      };

      await request(app)
        .post('/api/career/assessment')
        .set('Authorization', `Bearer ${authToken}`)
        .send(assessmentData)
        .expect(200);

      // Then get assessments
      const response = await request(app)
        .get('/api/career/assessments')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('assessments');
      expect(Array.isArray(response.body.assessments)).toBe(true);
      expect(response.body.assessments.length).toBe(1);
    });
  });

  describe('User Profile API', () => {
    beforeEach(async () => {
      // Register a user for profile tests
      const userData = {
        username: 'profileuser',
        password: 'testpass123',
        email: 'profile@example.com'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      authToken = response.body.token;
      testUserId = response.body.user.id;
    });

    test('PUT /api/users/profile should update user profile', async () => {
      const profileData = {
        phone: '+1234567890',
        location: 'New York, NY',
        institution: 'Test University',
        degree: 'Computer Science',
        graduation_year: '2024',
        skills: 'JavaScript, React, Node.js'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Profile updated successfully');
    });

    test('GET /api/users/profile should return user profile', async () => {
      // First update profile
      const profileData = {
        phone: '+1234567890',
        location: 'New York, NY',
        institution: 'Test University'
      };

      await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(200);

      // Then get profile
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.user).toHaveProperty('phone', '+1234567890');
      expect(response.body.user).toHaveProperty('location', 'New York, NY');
    });
  });

  describe('Authorization', () => {
    test('Protected routes should require authentication', async () => {
      await request(app)
        .get('/api/auth/me')
        .expect(401);

      await request(app)
        .post('/api/quiz/submit')
        .send({ test_id: 'test', answers: [] })
        .expect(401);

      await request(app)
        .get('/api/users/profile')
        .expect(401);
    });

    test('Invalid token should be rejected', async () => {
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);
    });
  });
});
