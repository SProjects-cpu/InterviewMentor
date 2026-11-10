"""
MongoDB Models and Schema Definitions
Defines collection schemas, validation rules, and indexes for the Interview Mentor application
"""

import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from pymongo import IndexModel, ASCENDING, DESCENDING, TEXT
from pymongo.errors import OperationFailure

logger = logging.getLogger(__name__)

class MongoDBSchemas:
    """MongoDB collection schemas and validation rules"""
    
    @staticmethod
    def get_users_schema():
        """Users collection schema"""
        return {
            "bsonType": "object",
            "required": ["_id", "username", "password"],
            "properties": {
                "_id": {
                    "bsonType": "string",
                    "description": "User ID (same as username for compatibility)"
                },
                "username": {
                    "bsonType": "string",
                    "minLength": 3,
                    "maxLength": 50,
                    "description": "Unique username"
                },
                "password": {
                    "bsonType": "string",
                    "minLength": 6,
                    "description": "Hashed password"
                },
                "email": {
                    "bsonType": ["string", "null"],
                    "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                    "description": "User email address"
                },
                "created_at": {
                    "bsonType": "date",
                    "description": "Account creation timestamp"
                }
            }
        }
    
    @staticmethod
    def get_quiz_results_schema():
        """Quiz results collection schema"""
        return {
            "bsonType": "object",
            "required": ["user_id", "score", "total_questions"],
            "properties": {
                "user_id": {
                    "bsonType": "string",
                    "description": "Reference to user ID"
                },
                "test_id": {
                    "bsonType": ["string", "null"],
                    "description": "Test identifier"
                },
                "score": {
                    "bsonType": "int",
                    "minimum": 0,
                    "description": "Quiz score"
                },
                "total_questions": {
                    "bsonType": "int",
                    "minimum": 1,
                    "description": "Total number of questions"
                },
                "answers": {
                    "bsonType": ["string", "null"],
                    "description": "JSON string of user answers"
                },
                "timestamp": {
                    "bsonType": "date",
                    "description": "Quiz completion timestamp"
                }
            }
        }
    
    @staticmethod
    def get_career_guidance_schema():
        """Career guidance collection schema"""
        return {
            "bsonType": "object",
            "required": ["user_id"],
            "properties": {
                "user_id": {
                    "bsonType": "string",
                    "description": "Reference to user ID"
                },
                "interests": {
                    "bsonType": ["string", "null"],
                    "description": "User interests"
                },
                "academic_score": {
                    "bsonType": ["int", "null"],
                    "minimum": 0,
                    "maximum": 100,
                    "description": "Academic score (0-100)"
                },
                "future_aspirations": {
                    "bsonType": ["string", "null"],
                    "description": "Future career aspirations"
                },
                "skills": {
                    "bsonType": ["string", "null"],
                    "description": "User skills"
                },
                "recommendations": {
                    "bsonType": ["string", "null"],
                    "description": "AI-generated career recommendations"
                },
                "timestamp": {
                    "bsonType": "date",
                    "description": "Guidance request timestamp"
                }
            }
        }
    
    @staticmethod
    def get_profile_details_schema():
        """Profile details collection schema"""
        return {
            "bsonType": "object",
            "required": ["user_id"],
            "properties": {
                "user_id": {
                    "bsonType": "string",
                    "description": "Reference to user ID (primary key)"
                },
                "phone": {
                    "bsonType": ["string", "null"],
                    "description": "Phone number"
                },
                "location": {
                    "bsonType": ["string", "null"],
                    "description": "User location"
                },
                "institution": {
                    "bsonType": ["string", "null"],
                    "description": "Educational institution"
                },
                "degree": {
                    "bsonType": ["string", "null"],
                    "description": "Degree/qualification"
                },
                "graduation_year": {
                    "bsonType": ["string", "null"],
                    "description": "Graduation year"
                },
                "skills": {
                    "bsonType": ["string", "null"],
                    "description": "User skills"
                },
                "profile_picture": {
                    "bsonType": ["string", "null"],
                    "description": "Profile picture URL/path"
                }
            }
        }
    
    @staticmethod
    def get_user_sessions_schema():
        """User sessions collection schema"""
        return {
            "bsonType": "object",
            "required": ["user_id", "session_data"],
            "properties": {
                "user_id": {
                    "bsonType": "string",
                    "description": "Reference to user ID"
                },
                "session_data": {
                    "bsonType": "string",
                    "description": "JSON string of session data"
                },
                "created_at": {
                    "bsonType": "date",
                    "description": "Session creation timestamp"
                }
            }
        }
    
    @staticmethod
    def get_coding_challenges_schema():
        """Coding challenges collection schema"""
        return {
            "bsonType": "object",
            "required": ["title", "subtitle", "difficulty", "description", "examples", "constraints", "solution_template", "test_cases"],
            "properties": {
                "title": {
                    "bsonType": "string",
                    "description": "Challenge title"
                },
                "subtitle": {
                    "bsonType": "string",
                    "description": "Challenge subtitle"
                },
                "difficulty": {
                    "bsonType": "string",
                    "enum": ["Easy", "Medium", "Hard"],
                    "description": "Challenge difficulty level"
                },
                "description": {
                    "bsonType": "string",
                    "description": "Challenge description"
                },
                "examples": {
                    "bsonType": "string",
                    "description": "Challenge examples"
                },
                "constraints": {
                    "bsonType": "string",
                    "description": "Challenge constraints"
                },
                "solution_template": {
                    "bsonType": "string",
                    "description": "Solution template code"
                },
                "test_cases": {
                    "bsonType": "string",
                    "description": "JSON string of test cases"
                },
                "created_at": {
                    "bsonType": "date",
                    "description": "Challenge creation timestamp"
                }
            }
        }
    
    @staticmethod
    def get_user_solutions_schema():
        """User solutions collection schema"""
        return {
            "bsonType": "object",
            "required": ["user_id", "challenge_id", "language", "code", "status"],
            "properties": {
                "user_id": {
                    "bsonType": "string",
                    "description": "Reference to user ID"
                },
                "challenge_id": {
                    "bsonType": "int",
                    "description": "Reference to challenge ID"
                },
                "language": {
                    "bsonType": "string",
                    "description": "Programming language"
                },
                "code": {
                    "bsonType": "string",
                    "description": "User's solution code"
                },
                "status": {
                    "bsonType": "string",
                    "enum": ["success", "error", "timeout"],
                    "description": "Execution status"
                },
                "execution_time": {
                    "bsonType": ["double", "null"],
                    "description": "Code execution time"
                },
                "memory_usage": {
                    "bsonType": ["double", "null"],
                    "description": "Memory usage"
                },
                "ai_review": {
                    "bsonType": ["string", "null"],
                    "description": "AI-generated code review"
                },
                "created_at": {
                    "bsonType": "date",
                    "description": "Solution submission timestamp"
                }
            }
        }

class MongoDBIndexes:
    """MongoDB index definitions for performance optimization"""
    
    @staticmethod
    def get_users_indexes():
        """Users collection indexes"""
        return [
            IndexModel([("username", ASCENDING)], unique=True),
            IndexModel([("email", ASCENDING)], sparse=True),
            IndexModel([("created_at", DESCENDING)])
        ]
    
    @staticmethod
    def get_quiz_results_indexes():
        """Quiz results collection indexes"""
        return [
            IndexModel([("user_id", ASCENDING)]),
            IndexModel([("test_id", ASCENDING)]),
            IndexModel([("timestamp", DESCENDING)]),
            IndexModel([("user_id", ASCENDING), ("timestamp", DESCENDING)])
        ]
    
    @staticmethod
    def get_career_guidance_indexes():
        """Career guidance collection indexes"""
        return [
            IndexModel([("user_id", ASCENDING)]),
            IndexModel([("timestamp", DESCENDING)]),
            IndexModel([("user_id", ASCENDING), ("timestamp", DESCENDING)])
        ]
    
    @staticmethod
    def get_profile_details_indexes():
        """Profile details collection indexes"""
        return [
            IndexModel([("user_id", ASCENDING)], unique=True)
        ]
    
    @staticmethod
    def get_user_sessions_indexes():
        """User sessions collection indexes"""
        return [
            IndexModel([("user_id", ASCENDING)]),
            IndexModel([("created_at", DESCENDING)]),
            IndexModel([("created_at", ASCENDING)], expireAfterSeconds=86400)  # 24 hours TTL
        ]
    
    @staticmethod
    def get_coding_challenges_indexes():
        """Coding challenges collection indexes"""
        return [
            IndexModel([("difficulty", ASCENDING)]),
            IndexModel([("created_at", DESCENDING)]),
            IndexModel([("title", TEXT), ("description", TEXT)])
        ]
    
    @staticmethod
    def get_user_solutions_indexes():
        """User solutions collection indexes"""
        return [
            IndexModel([("user_id", ASCENDING)]),
            IndexModel([("challenge_id", ASCENDING)]),
            IndexModel([("user_id", ASCENDING), ("challenge_id", ASCENDING)]),
            IndexModel([("created_at", DESCENDING)]),
            IndexModel([("language", ASCENDING)])
        ]

# Collection configuration mapping
COLLECTION_CONFIGS = {
    "users": {
        "schema": MongoDBSchemas.get_users_schema(),
        "indexes": MongoDBIndexes.get_users_indexes()
    },
    "quizResults": {
        "schema": MongoDBSchemas.get_quiz_results_schema(),
        "indexes": MongoDBIndexes.get_quiz_results_indexes()
    },
    "careerGuidance": {
        "schema": MongoDBSchemas.get_career_guidance_schema(),
        "indexes": MongoDBIndexes.get_career_guidance_indexes()
    },
    "profileDetails": {
        "schema": MongoDBSchemas.get_profile_details_schema(),
        "indexes": MongoDBIndexes.get_profile_details_indexes()
    },
    "userSessions": {
        "schema": MongoDBSchemas.get_user_sessions_schema(),
        "indexes": MongoDBIndexes.get_user_sessions_indexes()
    },
    "codingChallenges": {
        "schema": MongoDBSchemas.get_coding_challenges_schema(),
        "indexes": MongoDBIndexes.get_coding_challenges_indexes()
    },
    "userSolutions": {
        "schema": MongoDBSchemas.get_user_solutions_schema(),
        "indexes": MongoDBIndexes.get_user_solutions_indexes()
    }
}
