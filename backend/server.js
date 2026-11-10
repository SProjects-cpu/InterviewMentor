/**
 * Interview Mentor Express.js Server
 * Phase 3: Flask to Express Migration
 */

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

// Import GraphQL schema and resolvers
const { typeDefs, resolvers } = require('./graphql');
const { initializeMemoryDB } = require('./config/memory-db');

// Import routes
const userRoutes = require('./routes/users');
const quizRoutes = require('./routes/quiz');
const careerRoutes = require('./routes/career');
const codingRoutes = require('./routes/coding');
const resumeRoutes = require('./routes/resume');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/logger');

// Import database connection
const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// General middleware
app.use(compression());
app.use(limiter);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom middleware
app.use(requestLogger);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Interview Mentor Express Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Apollo Server setup function
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Authentication context removed
      return { req };
    },
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production'
  });

  await server.start();
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: false // We handle CORS above
  });

  console.log(`🚀 GraphQL Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  return server;
}

// Routes will be set up in startServer() after Apollo Server is initialized

// Start server function
async function startServer() {
  try {
    // Connect to MongoDB
    const connectionStatus = await connectDB();
    console.log('✅ MongoDB connected successfully');

    // Initialize memory database if using simulator
    if (connectionStatus.isSimulator) {
      initializeMemoryDB();
    }

    // Start Apollo Server BEFORE setting up routes
    await startApolloServer();

    // Now set up API routes (after GraphQL middleware is applied)
    app.use('/api/users', userRoutes);
    app.use('/api/quiz', quizRoutes);
    app.use('/api/career', careerRoutes);
    app.use('/api/coding', codingRoutes);
    app.use('/api/resume', resumeRoutes);

    // Error handling middleware
    app.use(errorHandler);

    // 404 handler (must be last)
    app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        availableRoutes: [
          '/api/health',
          '/api/users/*',
          '/api/quiz/*',
          '/api/career/*',
          '/api/coding/*',
          '/api/resume/*',
          '/graphql'
        ]
      });
    });

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Express Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔍 GraphQL Playground: http://localhost:${PORT}/graphql`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = app;
