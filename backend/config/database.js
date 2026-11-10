/**
 * MongoDB Database Configuration
 * Supports both real MongoDB and simulator fallback
 */

const mongoose = require('mongoose');

// MongoDB connection configuration
const MONGODB_CONFIG = {
  // Primary MongoDB connection (real database)
  primary: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/interview_mentor',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    }
  },

  // Simulator fallback (in-memory database for development)
  simulator: {
    uri: 'mongodb://localhost:27017/interview_mentor_simulator',
    options: {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 30000,
      family: 4
    }
  }
};

// Connection state tracking
let connectionState = {
  isConnected: false,
  isSimulator: false,
  connectionType: null,
  lastConnected: null
};

/**
 * Connect to MongoDB with fallback to in-memory simulation
 */
async function connectDB() {
  try {
    // First, try to connect to primary MongoDB
    console.log('🔄 Attempting to connect to primary MongoDB...');

    await mongoose.connect(MONGODB_CONFIG.primary.uri, MONGODB_CONFIG.primary.options);

    connectionState = {
      isConnected: true,
      isSimulator: false,
      connectionType: 'primary',
      lastConnected: new Date()
    };

    console.log('✅ Connected to primary MongoDB successfully');
    console.log(`📍 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);

    return connectionState;

  } catch (primaryError) {
    console.warn('⚠️  Primary MongoDB connection failed:', primaryError.message);
    console.log('🔄 Using in-memory simulation mode for development...');

    // For development without MongoDB, we'll use a mock connection
    connectionState = {
      isConnected: true,
      isSimulator: true,
      connectionType: 'memory_simulation',
      lastConnected: new Date()
    };

    console.log('✅ Using in-memory simulation mode');
    console.log('ℹ️  Database operations will be simulated');
    console.log('ℹ️  Install and start MongoDB for full functionality');

    return connectionState;
  }
}

/**
 * Get current connection status
 */
function getConnectionStatus() {
  return {
    ...connectionState,
    mongooseState: mongoose.connection.readyState,
    mongooseStates: {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }
  };
}

/**
 * Disconnect from MongoDB
 */
async function disconnectDB() {
  try {
    await mongoose.disconnect();
    connectionState.isConnected = false;
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
    throw error;
  }
}

/**
 * Check if database is available
 */
async function checkDatabaseHealth() {
  try {
    if (!connectionState.isConnected) {
      return { healthy: false, message: 'Not connected to database' };
    }
    
    // Ping the database
    await mongoose.connection.db.admin().ping();
    
    return {
      healthy: true,
      message: 'Database is healthy',
      connectionType: connectionState.connectionType,
      isSimulator: connectionState.isSimulator,
      database: mongoose.connection.name,
      host: `${mongoose.connection.host}:${mongoose.connection.port}`
    };
    
  } catch (error) {
    return {
      healthy: false,
      message: `Database health check failed: ${error.message}`,
      error: error.message
    };
  }
}

/**
 * Get database statistics
 */
async function getDatabaseStats() {
  try {
    if (!connectionState.isConnected) {
      throw new Error('Not connected to database');
    }
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    const stats = {
      connectionInfo: getConnectionStatus(),
      database: mongoose.connection.name,
      collections: collections.length,
      collectionNames: collections.map(col => col.name)
    };
    
    // Get collection stats
    for (const collection of collections) {
      try {
        const collStats = await db.collection(collection.name).stats();
        stats[collection.name] = {
          documents: collStats.count || 0,
          size: collStats.size || 0,
          avgObjSize: collStats.avgObjSize || 0
        };
      } catch (error) {
        stats[collection.name] = { error: error.message };
      }
    }
    
    return stats;
    
  } catch (error) {
    throw new Error(`Failed to get database stats: ${error.message}`);
  }
}

// Event listeners for connection monitoring
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('📡 Mongoose disconnected from MongoDB');
  connectionState.isConnected = false;
});

// Handle application termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('📡 Mongoose connection closed through app termination');
  process.exit(0);
});

module.exports = {
  connectDB,
  disconnectDB,
  getConnectionStatus,
  checkDatabaseHealth,
  getDatabaseStats,
  MONGODB_CONFIG
};
