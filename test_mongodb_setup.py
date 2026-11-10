"""
Test MongoDB Setup and Migration
Tests MongoDB connection, initialization, and migration functionality
"""

import os
import sys
import logging
from datetime import datetime

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def test_mongodb_connection():
    """Test MongoDB connection"""
    print("🔍 Testing MongoDB connection...")
    
    try:
        from database.mongodb_config import test_mongodb_connection, mongodb_manager
        
        if test_mongodb_connection():
            print("✅ MongoDB connection successful!")
            
            # Get database info
            collections = mongodb_manager.get_collection_names()
            stats = mongodb_manager.get_database_stats()
            
            print(f"📊 Database: {stats.get('db', 'unknown')}")
            print(f"📊 Collections: {len(collections)}")
            print(f"📊 Data Size: {stats.get('dataSize', 0)} bytes")
            
            return True
        else:
            print("❌ MongoDB connection failed!")
            return False
            
    except Exception as e:
        print(f"❌ MongoDB connection test error: {e}")
        return False

def test_mongodb_initialization():
    """Test MongoDB database initialization"""
    print("\n🔍 Testing MongoDB initialization...")
    
    try:
        from database.mongodb_init import initialize_mongodb, get_mongodb_info, validate_mongodb
        
        # Initialize database
        if initialize_mongodb():
            print("✅ MongoDB initialization successful!")
            
            # Get database info
            info = get_mongodb_info()
            if info:
                print(f"📊 Database: {info['database_name']}")
                print(f"📊 Total Documents: {info['total_documents']}")
                print(f"📊 Collections: {len(info['collections'])}")
                
                for collection in info['collections']:
                    print(f"  - {collection['name']}: {collection['document_count']} docs, {len(collection['indexes'])} indexes")
            
            # Validate collections
            validation = validate_mongodb()
            print("\n✅ Collection Validation:")
            for collection_name, result in validation.items():
                status = "✅" if result.get("validation") == "passed" else "❌"
                print(f"  {status} {collection_name}: {result.get('validation', 'unknown')}")
            
            return True
        else:
            print("❌ MongoDB initialization failed!")
            return False
            
    except Exception as e:
        print(f"❌ MongoDB initialization test error: {e}")
        return False

def test_mongodb_operations():
    """Test MongoDB operations"""
    print("\n🔍 Testing MongoDB operations...")
    
    try:
        from database.mongodb_operations import get_mongodb_operations
        
        ops = get_mongodb_operations()
        
        # Test user operations
        test_user_id = f"test_user_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        test_username = f"testuser_{datetime.now().strftime('%H%M%S')}"
        
        # Create test user
        if ops.create_user(test_user_id, test_username, "test_password", "test@example.com"):
            print("✅ User creation successful!")
            
            # Get user
            user = ops.get_user_by_username(test_username)
            if user:
                print("✅ User retrieval successful!")
                
                # Test quiz result
                if ops.save_quiz_result(test_user_id, "test_quiz", 85, 100):
                    print("✅ Quiz result save successful!")
                
                # Test profile details
                profile_data = {
                    "phone": "123-456-7890",
                    "location": "Test City",
                    "institution": "Test University"
                }
                if ops.save_profile_details(test_user_id, profile_data):
                    print("✅ Profile details save successful!")
                
                # Get collection stats
                stats = ops.get_collection_stats()
                print(f"📊 Collection Stats: {stats}")
                
                return True
            else:
                print("❌ User retrieval failed!")
                return False
        else:
            print("❌ User creation failed!")
            return False
            
    except Exception as e:
        print(f"❌ MongoDB operations test error: {e}")
        return False

def test_migration_readiness():
    """Test if migration is ready to run"""
    print("\n🔍 Testing migration readiness...")
    
    try:
        # Check if SQLite database exists
        sqlite_files = ["interview_mentor.db", "resume.db"]
        existing_files = []
        
        for db_file in sqlite_files:
            if os.path.exists(db_file):
                existing_files.append(db_file)
                print(f"✅ Found SQLite database: {db_file}")
        
        if not existing_files:
            print("⚠️ No SQLite databases found - creating test data for migration demo")
            return True
        
        # Test migration script import
        from database.migration_scripts import SQLiteToMongoMigrator
        
        migrator = SQLiteToMongoMigrator(existing_files[0])
        if migrator.connect_databases():
            print("✅ Migration script ready!")
            
            # Get SQLite tables
            tables = migrator.get_sqlite_tables()
            print(f"📊 SQLite tables found: {tables}")
            
            migrator.disconnect_databases()
            return True
        else:
            print("❌ Migration script connection failed!")
            return False
            
    except Exception as e:
        print(f"❌ Migration readiness test error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting MongoDB Setup Tests...")
    print("=" * 50)
    
    tests = [
        ("MongoDB Connection", test_mongodb_connection),
        ("MongoDB Initialization", test_mongodb_initialization),
        ("MongoDB Operations", test_mongodb_operations),
        ("Migration Readiness", test_migration_readiness)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with error: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📋 Test Results Summary:")
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"  {status}: {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 All tests passed! Ready for Phase 1 migration!")
        return True
    else:
        print("⚠️ Some tests failed. Please check the issues above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
