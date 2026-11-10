# Interview Mentor Express Backend

## Phase 3: Flask to Express Migration

This is the Node.js/Express backend for the Interview Mentor application, migrated from Flask as part of Phase 3 of the technology stack migration.

## Features

- **Express.js** server with RESTful API endpoints
- **Apollo Server** for GraphQL API
- **MongoDB** integration with Mongoose ODM
- **JWT Authentication** with middleware
- **Comprehensive API** for aptitude tests, career guidance, and coding challenges
- **Error handling** and logging middleware
- **Rate limiting** and security features
- **Comprehensive test suite** with Jest and Supertest

## Architecture

```
backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── models/                  # Mongoose models
│   ├── User.js
│   ├── QuizResult.js
│   ├── CareerGuidance.js
│   ├── ProfileDetails.js
│   ├── CodingChallenge.js
│   ├── UserSolution.js
│   └── index.js
├── routes/                  # Express route handlers
│   ├── auth.js
│   ├── users.js
│   ├── quiz.js
│   ├── career.js
│   └── coding.js
├── middleware/              # Custom middleware
│   ├── auth.js
│   ├── errorHandler.js
│   └── logger.js
├── graphql/                 # GraphQL schema and resolvers
│   ├── typeDefs.js
│   ├── resolvers.js
│   └── index.js
├── tests/                   # Test suite
│   └── api.test.js
├── server.js               # Main server file
├── package.json
└── README.md
```

## Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB:**
   ```bash
   # Make sure MongoDB is running locally or update MONGODB_URI in .env
   mongod
   ```

4. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interview_mentor
JWT_SECRET_KEY=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/verify` - Verify JWT token

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:userId/profile` - Get public user profile
- `DELETE /api/users/account` - Delete user account
- `GET /api/users/stats` - Get user statistics

### Quiz/Aptitude Tests
- `GET /api/quiz/aptitude/categories` - Get test categories
- `GET /api/quiz/aptitude/categories/:categoryId` - Get category tests
- `GET /api/quiz/test/:testId/questions` - Get test questions
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/results` - Get user quiz results
- `GET /api/quiz/results/:resultId` - Get specific quiz result

### Career Guidance
- `POST /api/career/assessment` - Submit career assessment
- `GET /api/career/assessments` - Get user assessments
- `GET /api/career/assessments/:assessmentId` - Get specific assessment
- `GET /api/career/latest` - Get latest assessment
- `PUT /api/career/assessments/:assessmentId` - Update assessment
- `DELETE /api/career/assessments/:assessmentId` - Delete assessment

### Coding Challenges
- `GET /api/coding/challenges` - Get coding challenges
- `GET /api/coding/challenges/:challengeId` - Get specific challenge
- `POST /api/coding/submit` - Submit code solution
- `GET /api/coding/solutions` - Get user solutions
- `GET /api/coding/solutions/:solutionId` - Get specific solution
- `GET /api/coding/stats` - Get coding statistics

### GraphQL
- `POST /graphql` - GraphQL endpoint
- `GET /graphql` - GraphQL Playground (development only)

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Development

```bash
# Start development server with auto-reload
npm run dev

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## Database

The application uses MongoDB with Mongoose ODM. The database configuration supports:

- **Primary MongoDB connection** for production
- **Simulator fallback** for development when MongoDB is not available
- **Automatic schema validation** and indexing
- **Connection health monitoring**

### Collections

- `users` - User accounts and authentication
- `quizResults` - Aptitude test results
- `careerGuidance` - Career assessment data
- `profileDetails` - User profile information
- `codingChallenges` - Coding challenge definitions
- `userSolutions` - User code submissions

## Security Features

- **JWT Authentication** with secure token handling
- **Password hashing** using SHA-256 (Flask compatibility)
- **Rate limiting** to prevent abuse
- **CORS configuration** for frontend integration
- **Input validation** with express-validator
- **Security headers** with Helmet.js
- **Error handling** without information leakage

## Performance Features

- **Compression** middleware for response optimization
- **Connection pooling** for MongoDB
- **Request logging** and monitoring
- **Efficient database queries** with proper indexing
- **Caching strategies** for frequently accessed data

## Migration from Flask

This Express backend maintains **100% API compatibility** with the original Flask backend:

- **Same endpoint URLs** and request/response formats
- **Compatible authentication** using same JWT secret and hashing
- **Identical database schema** and operations
- **Same business logic** and validation rules
- **Backward compatible** with existing frontend

## Deployment

1. **Set production environment variables**
2. **Build and start the application:**
   ```bash
   npm start
   ```
3. **Configure reverse proxy** (nginx/Apache) if needed
4. **Set up process manager** (PM2) for production
5. **Configure monitoring** and logging

## Contributing

1. Follow the existing code style and patterns
2. Add tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## License

This project is part of the Interview Mentor application.
