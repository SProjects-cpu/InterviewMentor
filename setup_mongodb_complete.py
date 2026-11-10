#!/usr/bin/env python3
"""
Complete MongoDB Setup Script for Interview Mentor
This script will set up MongoDB completely once it's installed
"""

import os
import sys
import subprocess
import time
import logging
from datetime import datetime

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def check_mongodb_installed():
    """Check if MongoDB is installed and accessible"""
    try:
        result = subprocess.run(['mongosh', '--version'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            logger.info(f"✅ MongoDB Shell found: {result.stdout.strip()}")
            return True
        else:
            logger.error("❌ MongoDB Shell not found")
            return False
    except (subprocess.TimeoutExpired, FileNotFoundError):
        logger.error("❌ MongoDB Shell not found or not accessible")
        return False

def check_mongodb_service():
    """Check if MongoDB service is running"""
    try:
        # Try to connect using mongosh
        result = subprocess.run(['mongosh', '--eval', 'db.runCommand("ping")'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0 and 'ok' in result.stdout:
            logger.info("✅ MongoDB service is running")
            return True
        else:
            logger.error("❌ MongoDB service is not running")
            return False
    except (subprocess.TimeoutExpired, FileNotFoundError):
        logger.error("❌ Cannot connect to MongoDB service")
        return False

def start_mongodb_service():
    """Start MongoDB service"""
    try:
        logger.info("🔄 Attempting to start MongoDB service...")
        
        # Try to start MongoDB service on Windows
        result = subprocess.run(['net', 'start', 'MongoDB'], 
                              capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            logger.info("✅ MongoDB service started successfully")
            time.sleep(3)  # Wait for service to fully start
            return True
        else:
            logger.error(f"❌ Failed to start MongoDB service: {result.stderr}")
            return False
            
    except (subprocess.TimeoutExpired, FileNotFoundError) as e:
        logger.error(f"❌ Error starting MongoDB service: {e}")
        return False

def test_python_mongodb_connection():
    """Test Python MongoDB connection"""
    try:
        logger.info("🔍 Testing Python MongoDB connection...")
        
        # Import and test our MongoDB setup
        from database.mongodb_config import test_mongodb_connection
        
        if test_mongodb_connection():
            logger.info("✅ Python MongoDB connection successful")
            return True
        else:
            logger.error("❌ Python MongoDB connection failed")
            return False
            
    except Exception as e:
        logger.error(f"❌ Python MongoDB connection error: {e}")
        return False

def initialize_mongodb_database():
    """Initialize MongoDB database with collections and indexes"""
    try:
        logger.info("🔄 Initializing MongoDB database...")
        
        from database.mongodb_init import initialize_mongodb
        
        if initialize_mongodb():
            logger.info("✅ MongoDB database initialization successful")
            return True
        else:
            logger.error("❌ MongoDB database initialization failed")
            return False
            
    except Exception as e:
        logger.error(f"❌ MongoDB database initialization error: {e}")
        return False

def run_migration():
    """Run migration from SQLite to MongoDB"""
    try:
        logger.info("🔄 Running migration from SQLite to MongoDB...")
        
        from database.migration_scripts import run_migration
        
        if run_migration():
            logger.info("✅ Migration completed successfully")
            return True
        else:
            logger.error("❌ Migration failed")
            return False
            
    except Exception as e:
        logger.error(f"❌ Migration error: {e}")
        return False

def test_complete_setup():
    """Test the complete MongoDB setup"""
    try:
        logger.info("🔍 Testing complete MongoDB setup...")
        
        # Run our comprehensive test
        result = subprocess.run([sys.executable, 'test_mongodb_setup.py'], 
                              capture_output=True, text=True, timeout=120)
        
        if result.returncode == 0 and "All tests passed" in result.stdout:
            logger.info("✅ Complete MongoDB setup test passed")
            return True
        else:
            logger.error("❌ Complete MongoDB setup test failed")
            logger.error(f"Output: {result.stdout}")
            logger.error(f"Error: {result.stderr}")
            return False
            
    except Exception as e:
        logger.error(f"❌ Complete setup test error: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Starting Complete MongoDB Setup for Interview Mentor")
    print("=" * 60)
    
    steps = [
        ("Check MongoDB Installation", check_mongodb_installed),
        ("Check MongoDB Service", check_mongodb_service),
        ("Test Python MongoDB Connection", test_python_mongodb_connection),
        ("Initialize MongoDB Database", initialize_mongodb_database),
        ("Test Complete Setup", test_complete_setup),
    ]
    
    # If MongoDB service is not running, try to start it
    if not check_mongodb_service():
        logger.info("MongoDB service not running, attempting to start...")
        if not start_mongodb_service():
            logger.error("❌ Cannot start MongoDB service. Please start it manually.")
            logger.error("💡 Try: net start MongoDB")
            logger.error("💡 Or use Services (Win + R, type 'services.msc', find MongoDB)")
            return False
    
    # Run all setup steps
    results = []
    for step_name, step_func in steps:
        logger.info(f"\n🔄 {step_name}...")
        try:
            result = step_func()
            results.append((step_name, result))
            if result:
                logger.info(f"✅ {step_name} - SUCCESS")
            else:
                logger.error(f"❌ {step_name} - FAILED")
        except Exception as e:
            logger.error(f"❌ {step_name} - ERROR: {e}")
            results.append((step_name, False))
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 Setup Results Summary:")
    
    passed = 0
    for step_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"  {status}: {step_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(results)} steps completed successfully")
    
    if passed == len(results):
        print("🎉 MongoDB setup completed successfully!")
        print("🚀 Your Interview Mentor project is now ready with MongoDB!")
        print("\n📝 Next steps:")
        print("  1. Start your backend: python api_app.py")
        print("  2. Start your frontend: cd frontend && npm run dev")
        print("  3. Test the application at http://localhost:3000")
        return True
    else:
        print("⚠️ Some setup steps failed. Please check the errors above.")
        print("\n💡 Common solutions:")
        print("  - Ensure MongoDB is installed and running")
        print("  - Check Windows Services for MongoDB service")
        print("  - Try running as Administrator")
        print("  - Check firewall settings")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
