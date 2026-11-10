"""
SQLite to MongoDB Migration Scripts
Handles data export from SQLite and import to MongoDB with data transformation
"""

import sqlite3
import json
import logging
import sys
import os
from datetime import datetime
from typing import Dict, List, Any, Optional

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.mongodb_config import get_database
from database.mongodb_init import initialize_mongodb

logger = logging.getLogger(__name__)

class SQLiteToMongoMigrator:
    """Migrate data from SQLite to MongoDB"""
    
    def __init__(self, sqlite_db_path: str = "interview_mentor.db"):
        self.sqlite_db_path = sqlite_db_path
        self.mongodb = None
        self.sqlite_conn = None
        
    def connect_databases(self):
        """Connect to both SQLite and MongoDB"""
        try:
            # Connect to SQLite
            self.sqlite_conn = sqlite3.connect(self.sqlite_db_path)
            self.sqlite_conn.row_factory = sqlite3.Row
            logger.info(f"Connected to SQLite database: {self.sqlite_db_path}")
            
            # Connect to MongoDB
            self.mongodb = get_database()
            logger.info("Connected to MongoDB database")
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to connect to databases: {e}")
            return False
    
    def disconnect_databases(self):
        """Disconnect from databases"""
        if self.sqlite_conn:
            self.sqlite_conn.close()
            logger.info("Disconnected from SQLite")
    
    def get_sqlite_tables(self):
        """Get list of tables in SQLite database"""
        try:
            cursor = self.sqlite_conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = [row[0] for row in cursor.fetchall()]
            logger.info(f"Found SQLite tables: {tables}")
            return tables
        except Exception as e:
            logger.error(f"Failed to get SQLite tables: {e}")
            return []
    
    def export_sqlite_table(self, table_name: str) -> List[Dict]:
        """Export data from SQLite table"""
        try:
            cursor = self.sqlite_conn.cursor()
            cursor.execute(f"SELECT * FROM {table_name}")
            rows = cursor.fetchall()
            
            # Convert rows to dictionaries
            data = []
            for row in rows:
                row_dict = dict(row)
                data.append(row_dict)
            
            logger.info(f"Exported {len(data)} records from table '{table_name}'")
            return data
            
        except Exception as e:
            logger.error(f"Failed to export table '{table_name}': {e}")
            return []
    
    def transform_users_data(self, sqlite_data: List[Dict]) -> List[Dict]:
        """Transform users data for MongoDB"""
        transformed_data = []
        
        for record in sqlite_data:
            mongo_record = {
                "_id": record["id"],  # Use id as _id
                "username": record["username"],
                "password": record["password"],
                "email": record.get("email"),
                "created_at": self._parse_datetime(record.get("created_at")) or datetime.utcnow()
            }
            transformed_data.append(mongo_record)
        
        return transformed_data
    
    def transform_quiz_results_data(self, sqlite_data: List[Dict]) -> List[Dict]:
        """Transform quiz results data for MongoDB"""
        transformed_data = []
        
        for record in sqlite_data:
            mongo_record = {
                "user_id": record["user_id"],
                "test_id": record.get("test_id"),
                "score": int(record["score"]),
                "total_questions": int(record["total_questions"]),
                "answers": record.get("answers"),
                "timestamp": self._parse_datetime(record.get("timestamp")) or datetime.utcnow()
            }
            transformed_data.append(mongo_record)
        
        return transformed_data
    
    def transform_career_guidance_data(self, sqlite_data: List[Dict]) -> List[Dict]:
        """Transform career guidance data for MongoDB"""
        transformed_data = []
        
        for record in sqlite_data:
            mongo_record = {
                "user_id": record["user_id"],
                "interests": record.get("interests"),
                "academic_score": int(record["academic_score"]) if record.get("academic_score") else None,
                "future_aspirations": record.get("future_aspirations"),
                "skills": record.get("skills"),
                "recommendations": record.get("recommendations"),
                "timestamp": self._parse_datetime(record.get("timestamp")) or datetime.utcnow()
            }
            transformed_data.append(mongo_record)
        
        return transformed_data
    
    def transform_profile_details_data(self, sqlite_data: List[Dict]) -> List[Dict]:
        """Transform profile details data for MongoDB"""
        transformed_data = []
        
        for record in sqlite_data:
            mongo_record = {
                "user_id": record["user_id"],
                "phone": record.get("phone"),
                "location": record.get("location"),
                "institution": record.get("institution"),
                "degree": record.get("degree"),
                "graduation_year": record.get("graduation_year"),
                "skills": record.get("skills"),
                "profile_picture": record.get("profile_picture")
            }
            transformed_data.append(mongo_record)
        
        return transformed_data
    
    def transform_user_sessions_data(self, sqlite_data: List[Dict]) -> List[Dict]:
        """Transform user sessions data for MongoDB"""
        transformed_data = []
        
        for record in sqlite_data:
            mongo_record = {
                "user_id": record["user_id"],
                "session_data": record["session_data"],
                "created_at": self._parse_datetime(record.get("created_at")) or datetime.utcnow()
            }
            transformed_data.append(mongo_record)
        
        return transformed_data
    
    def transform_coding_challenges_data(self, sqlite_data: List[Dict]) -> List[Dict]:
        """Transform coding challenges data for MongoDB"""
        transformed_data = []
        
        for record in sqlite_data:
            mongo_record = {
                "_id": record["id"],  # Use id as _id
                "title": record["title"],
                "subtitle": record["subtitle"],
                "difficulty": record["difficulty"],
                "description": record["description"],
                "examples": record["examples"],
                "constraints": record["constraints"],
                "solution_template": record["solution_template"],
                "test_cases": record["test_cases"],
                "created_at": self._parse_datetime(record.get("created_at")) or datetime.utcnow()
            }
            transformed_data.append(mongo_record)
        
        return transformed_data
    
    def transform_user_solutions_data(self, sqlite_data: List[Dict]) -> List[Dict]:
        """Transform user solutions data for MongoDB"""
        transformed_data = []
        
        for record in sqlite_data:
            mongo_record = {
                "user_id": str(record["user_id"]),  # Ensure string type
                "challenge_id": int(record["challenge_id"]),
                "language": record["language"],
                "code": record["code"],
                "status": record["status"],
                "execution_time": float(record["execution_time"]) if record.get("execution_time") else None,
                "memory_usage": float(record["memory_usage"]) if record.get("memory_usage") else None,
                "ai_review": record.get("ai_review"),
                "created_at": self._parse_datetime(record.get("created_at")) or datetime.utcnow()
            }
            transformed_data.append(mongo_record)
        
        return transformed_data
    
    def _parse_datetime(self, datetime_str: str) -> Optional[datetime]:
        """Parse datetime string to datetime object"""
        if not datetime_str:
            return None
        
        try:
            # Try different datetime formats
            formats = [
                "%Y-%m-%d %H:%M:%S",
                "%Y-%m-%d %H:%M:%S.%f",
                "%Y-%m-%dT%H:%M:%S",
                "%Y-%m-%dT%H:%M:%S.%f"
            ]
            
            for fmt in formats:
                try:
                    return datetime.strptime(datetime_str, fmt)
                except ValueError:
                    continue
            
            logger.warning(f"Could not parse datetime: {datetime_str}")
            return None
            
        except Exception as e:
            logger.warning(f"Error parsing datetime '{datetime_str}': {e}")
            return None
    
    def migrate_table(self, sqlite_table: str, mongo_collection: str, transform_func) -> bool:
        """Migrate a single table from SQLite to MongoDB"""
        try:
            logger.info(f"🔄 Migrating {sqlite_table} → {mongo_collection}")
            
            # Export data from SQLite
            sqlite_data = self.export_sqlite_table(sqlite_table)
            if not sqlite_data:
                logger.info(f"No data found in table '{sqlite_table}'")
                return True
            
            # Transform data
            mongo_data = transform_func(sqlite_data)
            
            # Import to MongoDB
            collection = self.mongodb[mongo_collection]
            
            # Clear existing data (optional - remove if you want to preserve)
            # collection.delete_many({})
            
            # Insert transformed data
            if mongo_data:
                result = collection.insert_many(mongo_data)
                logger.info(f"✅ Migrated {len(result.inserted_ids)} records to '{mongo_collection}'")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to migrate {sqlite_table} → {mongo_collection}: {e}")
            return False
    
    def run_full_migration(self) -> bool:
        """Run complete migration from SQLite to MongoDB"""
        try:
            logger.info("🚀 Starting full SQLite to MongoDB migration...")
            
            # Connect to databases
            if not self.connect_databases():
                return False
            
            # Initialize MongoDB (create collections and indexes)
            if not initialize_mongodb():
                logger.error("Failed to initialize MongoDB")
                return False
            
            # Migration mapping: sqlite_table → (mongo_collection, transform_function)
            migrations = [
                ("users", "users", self.transform_users_data),
                ("quiz_results", "quizResults", self.transform_quiz_results_data),
                ("career_guidance", "careerGuidance", self.transform_career_guidance_data),
                ("profile_details", "profileDetails", self.transform_profile_details_data),
                ("user_sessions", "userSessions", self.transform_user_sessions_data),
                ("coding_challenges", "codingChallenges", self.transform_coding_challenges_data),
                ("user_solutions", "userSolutions", self.transform_user_solutions_data)
            ]
            
            # Run migrations
            success_count = 0
            for sqlite_table, mongo_collection, transform_func in migrations:
                if self.migrate_table(sqlite_table, mongo_collection, transform_func):
                    success_count += 1
                else:
                    logger.error(f"Migration failed for {sqlite_table}")
            
            # Disconnect
            self.disconnect_databases()
            
            logger.info(f"✅ Migration completed: {success_count}/{len(migrations)} tables migrated successfully")
            return success_count == len(migrations)
            
        except Exception as e:
            logger.error(f"❌ Full migration failed: {e}")
            return False

def run_migration(sqlite_db_path: str = "interview_mentor.db") -> bool:
    """Run SQLite to MongoDB migration"""
    migrator = SQLiteToMongoMigrator(sqlite_db_path)
    return migrator.run_full_migration()

if __name__ == "__main__":
    # Run migration when script is executed directly
    print("🚀 Starting SQLite to MongoDB migration...")
    
    if run_migration():
        print("✅ Migration completed successfully!")
    else:
        print("❌ Migration failed!")
