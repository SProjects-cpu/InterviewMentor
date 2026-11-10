"""
MongoDB Database Initialization
Creates collections, applies schemas, and sets up indexes
"""

import logging
from pymongo.errors import OperationFailure, CollectionInvalid
from database.mongodb_config import get_database
from database.mongodb_models import COLLECTION_CONFIGS

logger = logging.getLogger(__name__)

class MongoDBInitializer:
    """Initialize MongoDB database with collections, schemas, and indexes"""
    
    def __init__(self):
        self.db = None
        
    def initialize_database(self):
        """Initialize the complete MongoDB database"""
        try:
            self.db = get_database()
            logger.info("Starting MongoDB database initialization...")
            
            # Create collections with validation
            self._create_collections()
            
            # Create indexes
            self._create_indexes()
            
            logger.info("✅ MongoDB database initialization completed successfully!")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize MongoDB database: {e}")
            return False
    
    def _create_collections(self):
        """Create collections with schema validation"""
        for collection_name, config in COLLECTION_CONFIGS.items():
            try:
                # Check if collection already exists
                if collection_name in self.db.list_collection_names():
                    logger.info(f"Collection '{collection_name}' already exists")
                    continue
                
                # Create collection with schema validation
                validator = {"$jsonSchema": config["schema"]}
                
                self.db.create_collection(
                    collection_name,
                    validator=validator,
                    validationLevel="strict",
                    validationAction="error"
                )
                
                logger.info(f"✅ Created collection '{collection_name}' with schema validation")
                
            except CollectionInvalid as e:
                logger.warning(f"Collection '{collection_name}' creation issue: {e}")
            except Exception as e:
                logger.error(f"Failed to create collection '{collection_name}': {e}")
                raise
    
    def _create_indexes(self):
        """Create indexes for all collections"""
        for collection_name, config in COLLECTION_CONFIGS.items():
            try:
                collection = self.db[collection_name]
                indexes = config["indexes"]
                
                if indexes:
                    # Create indexes
                    result = collection.create_indexes(indexes)
                    logger.info(f"✅ Created {len(result)} indexes for collection '{collection_name}'")
                else:
                    logger.info(f"No indexes defined for collection '{collection_name}'")
                    
            except Exception as e:
                logger.error(f"Failed to create indexes for collection '{collection_name}': {e}")
                raise
    
    def drop_database(self):
        """Drop the entire database (use with caution!)"""
        try:
            if self.db is not None:
                database_name = self.db.name
                self.db.client.drop_database(database_name)
                logger.warning(f"🗑️ Dropped database '{database_name}'")
                return True
        except Exception as e:
            logger.error(f"Failed to drop database: {e}")
            return False
    
    def reset_database(self):
        """Reset database by dropping and recreating"""
        try:
            logger.warning("🔄 Resetting MongoDB database...")
            self.drop_database()
            return self.initialize_database()
        except Exception as e:
            logger.error(f"Failed to reset database: {e}")
            return False
    
    def get_database_info(self):
        """Get database information and statistics"""
        try:
            if self.db is None:
                self.db = get_database()
            
            info = {
                "database_name": self.db.name,
                "collections": [],
                "total_documents": 0,
                "database_stats": self.db.command("dbStats")
            }
            
            # Get collection information
            for collection_name in self.db.list_collection_names():
                collection = self.db[collection_name]
                doc_count = collection.count_documents({})
                indexes = list(collection.list_indexes())
                
                collection_info = {
                    "name": collection_name,
                    "document_count": doc_count,
                    "indexes": [idx["name"] for idx in indexes]
                }
                
                info["collections"].append(collection_info)
                info["total_documents"] += doc_count
            
            return info
            
        except Exception as e:
            logger.error(f"Failed to get database info: {e}")
            return None
    
    def validate_collections(self):
        """Validate all collections and their schemas"""
        validation_results = {}

        for collection_name in COLLECTION_CONFIGS.keys():
            try:
                collection = self.db[collection_name]

                # Try to access the collection (works for both real MongoDB and simulator)
                try:
                    document_count = collection.count_documents({})
                    indexes = list(collection.list_indexes())
                    index_names = [idx.get("name", "unknown") for idx in indexes]

                    validation_results[collection_name] = {
                        "exists": True,
                        "document_count": document_count,
                        "indexes": index_names,
                        "validation": "passed"
                    }

                except Exception as collection_error:
                    # Collection might not exist or be accessible
                    validation_results[collection_name] = {
                        "exists": False,
                        "error": f"Collection access failed: {str(collection_error)}",
                        "validation": "failed"
                    }

            except Exception as e:
                validation_results[collection_name] = {
                    "exists": False,
                    "error": str(e),
                    "validation": "failed"
                }

        return validation_results

def initialize_mongodb():
    """Initialize MongoDB database"""
    initializer = MongoDBInitializer()
    return initializer.initialize_database()

def reset_mongodb():
    """Reset MongoDB database"""
    initializer = MongoDBInitializer()
    return initializer.reset_database()

def get_mongodb_info():
    """Get MongoDB database information"""
    initializer = MongoDBInitializer()
    return initializer.get_database_info()

def validate_mongodb():
    """Validate MongoDB collections"""
    initializer = MongoDBInitializer()
    return initializer.validate_collections()

if __name__ == "__main__":
    # Initialize database when run directly
    print("🚀 Initializing MongoDB database...")
    
    if initialize_mongodb():
        print("✅ Database initialization successful!")
        
        # Show database info
        info = get_mongodb_info()
        if info:
            print(f"\n📊 Database Info:")
            print(f"Database: {info['database_name']}")
            print(f"Total Documents: {info['total_documents']}")
            print(f"Collections: {len(info['collections'])}")
            
            for collection in info['collections']:
                print(f"  - {collection['name']}: {collection['document_count']} documents, {len(collection['indexes'])} indexes")
        
        # Validate collections
        validation = validate_mongodb()
        print(f"\n✅ Collection Validation:")
        for collection_name, result in validation.items():
            status = "✅" if result.get("validation") == "passed" else "❌"
            print(f"  {status} {collection_name}: {result.get('validation', 'unknown')}")
    else:
        print("❌ Database initialization failed!")
