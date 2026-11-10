/**
 * Logging Middleware
 * Request logging and monitoring
 */

const morgan = require('morgan');

/**
 * Custom request logger middleware
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request start
  console.log(`📥 ${req.method} ${req.originalUrl} - ${req.ip} - ${new Date().toISOString()}`);
  
  // Log request body for POST/PUT requests (excluding sensitive data)
  if ((req.method === 'POST' || req.method === 'PUT') && req.body) {
    const logBody = { ...req.body };
    
    // Remove sensitive fields
    delete logBody.password;
    delete logBody.token;
    delete logBody.secret;
    
    if (Object.keys(logBody).length > 0) {
      console.log(`📝 Request Body:`, JSON.stringify(logBody, null, 2));
    }
  }

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - start;
    
    // Log response
    console.log(`📤 ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    
    // Log response data for errors or in development
    if (res.statusCode >= 400 || process.env.NODE_ENV === 'development') {
      const logData = { ...data };
      
      // Remove sensitive fields from response logs
      if (logData.user) {
        delete logData.user.password;
      }
      if (logData.token) {
        logData.token = '[REDACTED]';
      }
      
      console.log(`📋 Response:`, JSON.stringify(logData, null, 2));
    }
    
    return originalJson.call(this, data);
  };

  next();
};

/**
 * Morgan configuration for different environments
 */
const getMorganFormat = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'combined';
  } else {
    return 'dev';
  }
};

/**
 * Custom Morgan token for response time in milliseconds
 */
morgan.token('response-time-ms', (req, res) => {
  const responseTime = res.getHeader('X-Response-Time');
  return responseTime ? `${responseTime}ms` : '-';
});

/**
 * Custom Morgan token for user ID
 */
morgan.token('user-id', (req, res) => {
  return req.current_user_id || 'anonymous';
});

/**
 * Custom Morgan format with additional information
 */
const customFormat = ':remote-addr - :user-id [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time-ms';

/**
 * API request logger using Morgan
 */
const apiLogger = morgan(process.env.NODE_ENV === 'production' ? 'combined' : customFormat, {
  skip: (req, res) => {
    // Skip logging for health checks in production
    if (process.env.NODE_ENV === 'production' && req.originalUrl === '/api/health') {
      return true;
    }
    return false;
  },
  stream: {
    write: (message) => {
      // Remove trailing newline and log with custom prefix
      console.log(`🌐 ${message.trim()}`);
    }
  }
});

/**
 * Error logger
 */
const errorLogger = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const userInfo = req.current_user_id ? `User: ${req.current_user_id}` : 'Anonymous';
  
  console.error(`❌ [${timestamp}] Error in ${req.method} ${req.originalUrl}`);
  console.error(`👤 ${userInfo}`);
  console.error(`💥 ${err.message}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.error(`📍 Stack trace:`, err.stack);
  }
  
  next(err);
};

/**
 * Performance logger
 */
const performanceLogger = (req, res, next) => {
  const start = process.hrtime.bigint();
  
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000000; // Convert to milliseconds
    
    // Log slow requests (> 1000ms)
    if (duration > 1000) {
      console.warn(`🐌 Slow request: ${req.method} ${req.originalUrl} - ${duration.toFixed(2)}ms`);
    }
    
    // Add response time header
    res.setHeader('X-Response-Time', duration.toFixed(2));
  });
  
  next();
};

module.exports = {
  requestLogger,
  apiLogger,
  errorLogger,
  performanceLogger
};
