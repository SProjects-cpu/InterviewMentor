"""
MongoDB Configuration and Connection Manager
Handles MongoDB connection, database initialization, and connection pooling
"""

import os
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Import simulator as fallback
try:
    from database.mongodb_simulator import get_simulator
    SIMULATOR_AVAILABLE = True
except ImportError:
    SIMULATOR_AVAILABLE = False

# Load environment variables
load_dotenv()

# MongoDB Configuration
MONGODB_URL = os.getenv('MONGODB_URL', 'mongodb://localhost:27017/')
DATABASE_NAME = os.getenv('MONGODB_DATABASE', 'interview_mentor')
CONNECTION_TIMEOUT = 10000  # 10 seconds
SERVER_SELECTION_TIMEOUT = 10000  # 10 seconds

# Fallback configurations
FALLBACK_URLS = [
    'mongodb://localhost:27017/',
    'mongodb://127.0.0.1:27017/',
]

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MongoDBManager:
    """MongoDB connection and database management"""

    def __init__(self):
        self.client = None
        self.database = None
        self.async_client = None
        self.async_database = None
        self.using_simulator = False
        self.simulator = None
        
    def connect(self):
        """Establish synchronous MongoDB connection with fallback URLs"""
        urls_to_try = [MONGODB_URL] + FALLBACK_URLS

        for url in urls_to_try:
            try:
                logger.info(f"Attempting to connect to MongoDB at {url}")

                self.client = MongoClient(
                    url,
                    connectTimeoutMS=CONNECTION_TIMEOUT,
                    serverSelectionTimeoutMS=SERVER_SELECTION_TIMEOUT,
                    maxPoolSize=50,
                    minPoolSize=5
                )

                # Test the connection
                self.client.admin.command('ping')
                self.database = self.client[DATABASE_NAME]

                logger.info(f"✅ Successfully connected to MongoDB at {url}")
                logger.info(f"Using database: {DATABASE_NAME}")
                return True

            except (ConnectionFailure, ServerSelectionTimeoutError) as e:
                logger.warning(f"Failed to connect to {url}: {e}")
                continue
            except Exception as e:
                logger.warning(f"Unexpected error connecting to {url}: {e}")
                continue

        # If all connections failed, try simulator
        if SIMULATOR_AVAILABLE:
            logger.warning("⚠️ MongoDB not available, using simulator for testing")
            self.simulator = get_simulator()
            if self.simulator.connect():
                self.using_simulator = True
                self.database = DatabaseSimulatorWrapper(self.simulator)
                logger.info("✅ Connected to MongoDB Simulator")
                return True

        # If all connections failed
        logger.error("❌ Failed to connect to MongoDB with all attempted URLs")
        logger.error("💡 Please ensure MongoDB is running or check your connection string")
        logger.error("📖 See MONGODB_SETUP_GUIDE.md for setup instructions")
        return False
    
    def connect_async(self):
        """Establish asynchronous MongoDB connection"""
        try:
            self.async_client = AsyncIOMotorClient(
                MONGODB_URL,
                connectTimeoutMS=CONNECTION_TIMEOUT,
                serverSelectionTimeoutMS=SERVER_SELECTION_TIMEOUT,
                maxPoolSize=50,
                minPoolSize=5
            )
            
            self.async_database = self.async_client[DATABASE_NAME]
            logger.info("Successfully established async MongoDB connection")
            return True
            
        except Exception as e:
            logger.error(f"Failed to establish async MongoDB connection: {e}")
            return False
    
    def disconnect(self):
        """Close MongoDB connections"""
        if self.client:
            self.client.close()
            logger.info("Closed synchronous MongoDB connection")
        
        if self.async_client:
            self.async_client.close()
            logger.info("Closed asynchronous MongoDB connection")
    
    def get_database(self):
        """Get the database instance"""
        if self.database is None:
            if not self.connect():
                raise ConnectionError("Failed to connect to MongoDB")
        return self.database

    def get_async_database(self):
        """Get the async database instance"""
        if self.async_database is None:
            if not self.connect_async():
                raise ConnectionError("Failed to connect to async MongoDB")
        return self.async_database
    
    def test_connection(self):
        """Test MongoDB connection"""
        try:
            if self.database is None:
                self.connect()

            if self.using_simulator:
                # Test simulator connection
                ping_result = self.database.command('ping')
                if ping_result.get('ok') == 1:
                    logger.info("MongoDB Simulator connection test successful")
                    return True
                else:
                    logger.error("MongoDB Simulator connection test failed")
                    return False
            else:
                # Test real MongoDB connection
                # Ping the database
                self.client.admin.command('ping')

                # Test basic operations
                test_collection = self.database.test_connection
                test_doc = {"test": "connection", "timestamp": "2024-01-01"}

                # Insert test document
                result = test_collection.insert_one(test_doc)

                # Find test document
                found_doc = test_collection.find_one({"_id": result.inserted_id})

                # Delete test document
                test_collection.delete_one({"_id": result.inserted_id})

                if found_doc:
                    logger.info("MongoDB connection test successful")
                    return True
                else:
                    logger.error("MongoDB connection test failed - document not found")
                    return False

        except Exception as e:
            logger.error(f"MongoDB connection test failed: {e}")
            return False
    
    def get_collection_names(self):
        """Get list of all collection names"""
        try:
            if self.database is None:
                self.connect()
            return self.database.list_collection_names()
        except Exception as e:
            logger.error(f"Failed to get collection names: {e}")
            return []

    def get_database_stats(self):
        """Get database statistics"""
        try:
            if self.database is None:
                self.connect()
            return self.database.command("dbStats")
        except Exception as e:
            logger.error(f"Failed to get database stats: {e}")
            return {}

class DatabaseSimulatorWrapper:
    """Wrapper to make simulator compatible with MongoDB database interface"""

    def __init__(self, simulator):
        self.simulator = simulator
        self.name = DATABASE_NAME
        # Create collection properties for direct access
        self._setup_collections()

    def _setup_collections(self):
        """Setup collection properties for direct access"""
        collection_names = [
            "users", "quizResults", "careerGuidance", "profileDetails",
            "userSessions", "codingChallenges", "userSolutions"
        ]
        for name in collection_names:
            setattr(self, name, self.simulator.get_collection(name))

    def __getitem__(self, collection_name):
        """Get collection from simulator"""
        return self.simulator.get_collection(collection_name)

    def list_collection_names(self):
        """List collection names"""
        return self.simulator.list_collection_names()

    def command(self, command):
        """Execute database command"""
        return self.simulator.command(command)

    def create_collection(self, name, **kwargs):
        """Create collection"""
        result = self.simulator.create_collection(name, **kwargs)
        # Update collection properties after creation
        setattr(self, name, self.simulator.get_collection(name))
        return result

# Global MongoDB manager instance
mongodb_manager = MongoDBManager()

def get_database():
    """Get MongoDB database instance"""
    return mongodb_manager.get_database()

def get_async_database():
    """Get async MongoDB database instance"""
    return mongodb_manager.get_async_database()

def test_mongodb_connection():
    """Test MongoDB connection"""
    return mongodb_manager.test_connection()

def close_mongodb_connection():
    """Close MongoDB connection"""
    mongodb_manager.disconnect()

# Initialize connection on import
if __name__ == "__main__":
    # Test the connection when run directly
    print("Testing MongoDB connection...")
    if test_mongodb_connection():
        print("✅ MongoDB connection successful!")
        print(f"Database: {DATABASE_NAME}")
        print(f"Collections: {mongodb_manager.get_collection_names()}")
    else:
        print("❌ MongoDB connection failed!")
