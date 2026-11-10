"""
MongoDB Operations
Provides database operations to replace SQLite functionality
"""

import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from pymongo.errors import DuplicateKeyError, PyMongoError
from database.mongodb_config import get_database

logger = logging.getLogger(__name__)

class MongoDBOperations:
    """MongoDB database operations"""

    def __init__(self):
        self.db = None
        self._initialized = False

    def get_db(self):
        """Get database connection"""
        if self.db is None or not self._initialized:
            try:
                self.db = get_database()
                self._initialized = True
                logger.info("MongoDB operations initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize MongoDB operations: {e}")
                raise
        return self.db
    
    # User Operations
    def create_user(self, user_id: str, username: str, password: str, email: str = None) -> bool:
        """Create a new user with individual parameters"""
        try:
            user_data = {
                "_id": user_id,
                "username": username,
                "password": password,
                "email": email,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            db = self.get_db()
            db.users.insert_one(user_data)
            logger.info(f"Created user: {username}")
            return True

        except DuplicateKeyError:
            logger.warning(f"User already exists: {username}")
            return False
        except Exception as e:
            logger.error(f"Failed to create user {username}: {e}")
            return False

    def create_user_with_data(self, user_data: Dict) -> bool:
        """Create a new user with user data dict"""
        try:
            db = self.get_db()
            if 'created_at' not in user_data:
                user_data['created_at'] = datetime.utcnow()
            if 'updated_at' not in user_data:
                user_data['updated_at'] = datetime.utcnow()

            db.users.insert_one(user_data)
            logger.info(f"Created user: {user_data.get('username')}")
            return True

        except DuplicateKeyError:
            logger.warning(f"User already exists: {user_data.get('username')}")
            return False
        except Exception as e:
            logger.error(f"Failed to create user {user_data.get('username')}: {e}")
            return False
    
    def get_user_by_username(self, username: str) -> Optional[Dict]:
        """Get user by username"""
        try:
            db = self.get_db()
            user = db.users.find_one({"username": username})
            return user
        except Exception as e:
            logger.error(f"Failed to get user {username}: {e}")
            return None
    
    def get_user_by_id(self, user_id: str) -> Optional[Dict]:
        """Get user by ID"""
        try:
            db = self.get_db()
            user = db.users.find_one({"_id": user_id})
            return user
        except Exception as e:
            logger.error(f"Failed to get user {user_id}: {e}")
            return None
    
    def update_user(self, user_id: str, update_data: Dict) -> bool:
        """Update user data"""
        try:
            db = self.get_db()
            result = db.users.update_one(
                {"_id": user_id},
                {"$set": update_data}
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Failed to update user {user_id}: {e}")
            return False

    def get_all_users(self, limit: int = 10, offset: int = 0) -> List[Dict]:
        """Get all users with pagination"""
        try:
            db = self.get_db()
            users = list(db.users.find().skip(offset).limit(limit).sort("created_at", -1))
            return users
        except Exception as e:
            logger.error(f"Failed to get all users: {e}")
            return []
    
    # Quiz Results Operations
    def save_quiz_result(self, user_id: str, test_id: str, score: int, total_questions: int, answers: str = None) -> bool:
        """Save quiz result with individual parameters"""
        try:
            result_data = {
                "user_id": user_id,
                "test_id": test_id,
                "test_type": test_id,  # Add test_type for GraphQL compatibility
                "score": score,
                "total_questions": total_questions,
                "answers": answers,
                "timestamp": datetime.utcnow(),
                "created_at": datetime.utcnow()
            }
            db = self.get_db()
            result = db.quizResults.insert_one(result_data)
            logger.info(f"Saved quiz result for user {user_id}")
            return True

        except Exception as e:
            logger.error(f"Failed to save quiz result: {e}")
            return False

    def save_quiz_result_with_data(self, result_data: Dict) -> Optional[str]:
        """Save quiz result with result data dict"""
        try:
            db = self.get_db()
            if 'created_at' not in result_data:
                result_data['created_at'] = datetime.utcnow()
            if 'timestamp' not in result_data:
                result_data['timestamp'] = datetime.utcnow()

            result = db.quizResults.insert_one(result_data)
            logger.info(f"Saved quiz result for user {result_data.get('user_id')}")
            return str(result.inserted_id)

        except Exception as e:
            logger.error(f"Failed to save quiz result: {e}")
            return None
    
    def get_user_quiz_results(self, user_id: str, limit: int = 10) -> List[Dict]:
        """Get user's quiz results"""
        try:
            db = self.get_db()
            results = list(db.quizResults.find(
                {"user_id": user_id}
            ).sort("timestamp", -1).limit(limit))
            return results
        except Exception as e:
            logger.error(f"Failed to get quiz results for user {user_id}: {e}")
            return []

    def get_quiz_results(self, filters: Dict = None, limit: int = 10) -> List[Dict]:
        """Get quiz results with optional filters"""
        try:
            db = self.get_db()
            query = filters or {}
            results = list(db.quizResults.find(query).sort("created_at", -1).limit(limit))
            return results
        except Exception as e:
            logger.error(f"Failed to get quiz results: {e}")
            return []

    def get_quiz_result_by_id(self, result_id: str) -> Optional[Dict]:
        """Get quiz result by ID"""
        try:
            from bson import ObjectId
            db = self.get_db()
            result = db.quizResults.find_one({"_id": ObjectId(result_id)})
            return result
        except Exception as e:
            logger.error(f"Failed to get quiz result {result_id}: {e}")
            return None
    
    # Career Guidance Operations
    def save_career_guidance(self, guidance_data: Dict) -> Optional[str]:
        """Save career guidance data"""
        try:
            db = self.get_db()
            if 'created_at' not in guidance_data:
                guidance_data['created_at'] = datetime.utcnow()

            result = db.careerGuidance.insert_one(guidance_data)
            logger.info(f"Saved career guidance for user {guidance_data.get('user_id')}")
            return str(result.inserted_id)

        except Exception as e:
            logger.error(f"Failed to save career guidance: {e}")
            return None

    def save_career_guidance_legacy(self, user_id: str, interests: str, academic_score: int,
                           future_aspirations: str, skills: str, recommendations: str) -> bool:
        """Save career guidance data (legacy method)"""
        guidance_data = {
            "user_id": user_id,
            "interests": interests,
            "academic_score": academic_score,
            "future_aspirations": future_aspirations,
            "skills": skills,
            "recommendations": recommendations,
            "timestamp": datetime.utcnow(),
            "created_at": datetime.utcnow()
        }
        return self.save_career_guidance(guidance_data) is not None
    
    def get_user_career_guidance(self, user_id: str, limit: int = 5) -> List[Dict]:
        """Get user's career guidance history"""
        try:
            db = self.get_db()
            guidance = list(db.careerGuidance.find(
                {"user_id": user_id}
            ).sort("timestamp", -1).limit(limit))
            return guidance
        except Exception as e:
            logger.error(f"Failed to get career guidance for user {user_id}: {e}")
            return []

    def get_career_guidance_by_id(self, guidance_id: str) -> Optional[Dict]:
        """Get career guidance by ID"""
        try:
            from bson import ObjectId
            db = self.get_db()
            guidance = db.careerGuidance.find_one({"_id": ObjectId(guidance_id)})
            return guidance
        except Exception as e:
            logger.error(f"Failed to get career guidance {guidance_id}: {e}")
            return None
    
    # Profile Details Operations
    def save_profile_details(self, user_id: str, profile_data: Dict) -> bool:
        """Save or update profile details"""
        try:
            db = self.get_db()
            profile_data["user_id"] = user_id

            # Use upsert to insert or update
            result = db.profileDetails.replace_one(
                {"user_id": user_id},
                profile_data,
                upsert=True
            )

            logger.info(f"Saved profile details for user {user_id}")
            return True

        except Exception as e:
            logger.error(f"Failed to save profile details for user {user_id}: {e}")
            return False

    def update_profile_details(self, user_id: str, profile_data: Dict) -> bool:
        """Update profile details"""
        try:
            db = self.get_db()
            profile_data["user_id"] = user_id
            profile_data["updated_at"] = datetime.utcnow()

            result = db.profileDetails.replace_one(
                {"user_id": user_id},
                profile_data,
                upsert=True
            )

            logger.info(f"Updated profile details for user {user_id}")
            return True

        except Exception as e:
            logger.error(f"Failed to update profile details for user {user_id}: {e}")
            return False
    
    def get_profile_details(self, user_id: str) -> Optional[Dict]:
        """Get user's profile details"""
        try:
            db = self.get_db()
            profile = db.profileDetails.find_one({"user_id": user_id})
            return profile
        except Exception as e:
            logger.error(f"Failed to get profile details for user {user_id}: {e}")
            return None
    
    # User Sessions Operations
    def save_user_session(self, user_id: str, session_data: str) -> Optional[str]:
        """Save user session and return session ID"""
        try:
            db = self.get_db()
            session_doc = {
                "user_id": user_id,
                "session_data": session_data,
                "created_at": datetime.utcnow()
            }
            
            result = db.userSessions.insert_one(session_doc)
            logger.info(f"Saved session for user {user_id}")
            return str(result.inserted_id)
            
        except Exception as e:
            logger.error(f"Failed to save session for user {user_id}: {e}")
            return None
    
    def get_user_session(self, session_id: str, user_id: str) -> Optional[Dict]:
        """Get user session by ID"""
        try:
            from bson import ObjectId
            db = self.get_db()
            session = db.userSessions.find_one({
                "_id": ObjectId(session_id),
                "user_id": user_id
            })
            return session
        except Exception as e:
            logger.error(f"Failed to get session {session_id} for user {user_id}: {e}")
            return None
    
    def update_user_session(self, session_id: str, user_id: str, session_data: str) -> bool:
        """Update user session"""
        try:
            from bson import ObjectId
            db = self.get_db()
            result = db.userSessions.update_one(
                {"_id": ObjectId(session_id), "user_id": user_id},
                {"$set": {"session_data": session_data}}
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Failed to update session {session_id} for user {user_id}: {e}")
            return False
    
    # Coding Challenges Operations
    def get_all_coding_challenges(self) -> List[Dict]:
        """Get all coding challenges"""
        try:
            db = self.get_db()
            challenges = list(db.codingChallenges.find().sort("created_at", -1))
            return challenges
        except Exception as e:
            logger.error(f"Failed to get coding challenges: {e}")
            return []
    
    def get_coding_challenge_by_id(self, challenge_id: int) -> Optional[Dict]:
        """Get coding challenge by ID"""
        try:
            db = self.get_db()
            challenge = db.codingChallenges.find_one({"_id": challenge_id})
            return challenge
        except Exception as e:
            logger.error(f"Failed to get coding challenge {challenge_id}: {e}")
            return None
    
    def save_coding_challenge(self, challenge_data: Dict) -> bool:
        """Save a new coding challenge"""
        try:
            db = self.get_db()
            challenge_data["created_at"] = datetime.utcnow()
            db.codingChallenges.insert_one(challenge_data)
            logger.info(f"Saved coding challenge: {challenge_data.get('title', 'Unknown')}")
            return True
        except Exception as e:
            logger.error(f"Failed to save coding challenge: {e}")
            return False
    
    # User Solutions Operations
    def save_user_solution(self, solution_data: Dict) -> Optional[str]:
        """Save user's coding solution"""
        try:
            db = self.get_db()
            if 'submitted_at' not in solution_data:
                solution_data['submitted_at'] = datetime.utcnow()
            if 'created_at' not in solution_data:
                solution_data['created_at'] = datetime.utcnow()

            result = db.userSolutions.insert_one(solution_data)
            logger.info(f"Saved solution for user {solution_data.get('user_id')}")
            return str(result.inserted_id)

        except Exception as e:
            logger.error(f"Failed to save solution: {e}")
            return None

    def save_user_solution_legacy(self, user_id: str, challenge_id: int, language: str,
                          code: str, status: str, execution_time: float = None,
                          memory_usage: float = None, ai_review: str = None) -> bool:
        """Save user's coding solution (legacy method)"""
        solution_data = {
            "user_id": user_id,
            "challenge_id": challenge_id,
            "language": language,
            "code": code,
            "status": status,
            "execution_time": execution_time,
            "memory_usage": memory_usage,
            "ai_review": ai_review,
            "created_at": datetime.utcnow()
        }
        return self.save_user_solution(solution_data) is not None
    
    def get_user_solutions(self, user_id: str, limit: int = 20) -> List[Dict]:
        """Get user's coding solutions"""
        try:
            db = self.get_db()
            solutions = list(db.userSolutions.find(
                {"user_id": user_id}
            ).sort("created_at", -1).limit(limit))
            return solutions
        except Exception as e:
            logger.error(f"Failed to get solutions for user {user_id}: {e}")
            return []
    
    # Utility Operations
    def get_collection_stats(self) -> Dict:
        """Get statistics for all collections"""
        try:
            db = self.get_db()
            stats = {}

            collections = ["users", "quizResults", "careerGuidance", "profileDetails",
                          "userSessions", "codingChallenges", "userSolutions"]

            for collection_name in collections:
                collection = db[collection_name]
                count = collection.count_documents({})
                stats[collection_name] = count

            return stats

        except Exception as e:
            logger.error(f"Failed to get collection stats: {e}")
            return {}

    # Statistics Operations for GraphQL
    def get_user_statistics(self, user_id: str) -> Dict:
        """Get statistics for a specific user"""
        try:
            db = self.get_db()
            stats = {}

            # Count quiz results
            stats['total_quiz_results'] = db.quizResults.count_documents({"user_id": user_id})

            # Count coding solutions
            stats['total_coding_solutions'] = db.userSolutions.count_documents({"user_id": user_id})

            # Calculate average score
            quiz_results = list(db.quizResults.find({"user_id": user_id}, {"score": 1, "total_questions": 1}))
            if quiz_results:
                total_percentage = sum((result['score'] / result['total_questions']) * 100 for result in quiz_results)
                stats['average_score'] = total_percentage / len(quiz_results)
            else:
                stats['average_score'] = 0.0

            # Get popular test types
            pipeline = [
                {"$match": {"user_id": user_id}},
                {"$group": {"_id": "$test_type", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 5}
            ]
            popular_tests = list(db.quizResults.aggregate(pipeline))
            stats['popular_tests'] = [test['_id'] for test in popular_tests if test['_id']]

            return stats

        except Exception as e:
            logger.error(f"Failed to get user statistics for {user_id}: {e}")
            return {
                'total_quiz_results': 0,
                'total_coding_solutions': 0,
                'average_score': 0.0,
                'popular_tests': []
            }

    def get_global_statistics(self) -> Dict:
        """Get global application statistics"""
        try:
            db = self.get_db()
            stats = {}

            # Count total users
            stats['total_users'] = db.users.count_documents({})

            # Count total quiz results
            stats['total_quiz_results'] = db.quizResults.count_documents({})

            # Count total coding solutions
            stats['total_coding_solutions'] = db.userSolutions.count_documents({})

            # Calculate global average score
            quiz_results = list(db.quizResults.find({}, {"score": 1, "total_questions": 1}))
            if quiz_results:
                total_percentage = sum((result['score'] / result['total_questions']) * 100 for result in quiz_results)
                stats['average_score'] = total_percentage / len(quiz_results)
            else:
                stats['average_score'] = 0.0

            # Get popular test types globally
            pipeline = [
                {"$group": {"_id": "$test_type", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 10}
            ]
            popular_tests = list(db.quizResults.aggregate(pipeline))
            stats['popular_tests'] = [test['_id'] for test in popular_tests if test['_id']]

            return stats

        except Exception as e:
            logger.error(f"Failed to get global statistics: {e}")
            return {
                'total_users': 0,
                'total_quiz_results': 0,
                'total_coding_solutions': 0,
                'average_score': 0.0,
                'popular_tests': []
            }

# Global instance
mongodb_ops = MongoDBOperations()

# Convenience functions
def get_mongodb_operations():
    """Get MongoDB operations instance"""
    return mongodb_ops
