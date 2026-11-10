"""
GraphQL Queries for Interview Mentor Application
Implements all query resolvers for data fetching
"""

import graphene
from graphene import ObjectType, String, Int, List, Field, Boolean
from datetime import datetime
from typing import Optional, Dict, Any

from .types import (
    UserType, QuizResultType, CareerGuidanceType, ProfileDetailsType,
    UserSessionType, CodingChallengeType, UserSolutionType, StatsType,
    TestCategoryType, TestType
)

# Import MongoDB operations
from database.mongodb_operations import get_mongodb_operations


class Query(ObjectType):
    """Root Query class for GraphQL"""
    
    # User queries
    user = Field(UserType, id=String(required=True))
    users = List(UserType, limit=Int(default_value=10), offset=Int(default_value=0))
    current_user = Field(UserType)
    
    # Quiz result queries
    quiz_result = Field(QuizResultType, id=String(required=True))
    quiz_results = List(QuizResultType, user_id=String(), test_type=String(), limit=Int(default_value=10))
    user_quiz_results = List(QuizResultType, user_id=String(required=True))
    
    # Career guidance queries
    career_guidance = Field(CareerGuidanceType, id=String(required=True))
    user_career_guidance = List(CareerGuidanceType, user_id=String(required=True))
    
    # Profile queries
    profile_details = Field(ProfileDetailsType, user_id=String(required=True))
    
    # Session queries
    user_sessions = List(UserSessionType, user_id=String(required=True))
    active_sessions = List(UserSessionType, user_id=String(required=True))
    
    # Coding challenge queries
    coding_challenge = Field(CodingChallengeType, id=String(required=True))
    coding_challenges = List(CodingChallengeType, difficulty=String(), language=String())
    
    # User solution queries
    user_solution = Field(UserSolutionType, id=String(required=True))
    user_solutions = List(UserSolutionType, user_id=String(required=True), challenge_id=String())
    
    # Statistics queries
    user_stats = Field(StatsType, user_id=String(required=True))
    global_stats = Field(StatsType)
    
    # Test category queries
    test_categories = List(TestCategoryType)
    test_category = Field(TestCategoryType, id=String(required=True))
    category_tests = List(TestType, category_id=String(required=True))
    
    def __init__(self):
        """Initialize with MongoDB operations"""
        self.mongodb_ops = get_mongodb_operations()
    
    # User resolvers
    def resolve_user(self, info, id):
        """Get user by ID"""
        try:
            user = self.mongodb_ops.get_user_by_id(id)
            if user:
                return UserType(
                    id=user['_id'],
                    username=user['username'],
                    email=user.get('email'),
                    created_at=user.get('created_at')
                )
            return None
        except Exception as e:
            print(f"Error resolving user: {e}")
            return None
    
    def resolve_users(self, info, limit=10, offset=0):
        """Get list of users with pagination"""
        try:
            users = self.mongodb_ops.get_all_users(limit=limit, offset=offset)
            return [
                UserType(
                    id=user['_id'],
                    username=user['username'],
                    email=user.get('email'),
                    created_at=user.get('created_at')
                )
                for user in users
            ]
        except Exception as e:
            print(f"Error resolving users: {e}")
            return []
    
    def resolve_current_user(self, info):
        """Get current authenticated user"""
        # This would typically get user from context/token
        # For now, return None - will be implemented with authentication
        return None
    
    # Quiz result resolvers
    def resolve_quiz_result(self, info, id):
        """Get quiz result by ID"""
        try:
            result = self.mongodb_ops.get_quiz_result_by_id(id)
            if result:
                return QuizResultType(
                    id=result['_id'],
                    user_id=result['user_id'],
                    test_type=result['test_type'],
                    score=result['score'],
                    total_questions=result['total_questions'],
                    time_taken=result.get('time_taken'),
                    answers=result.get('answers', []),
                    created_at=result.get('created_at')
                )
            return None
        except Exception as e:
            print(f"Error resolving quiz result: {e}")
            return None
    
    def resolve_quiz_results(self, info, user_id=None, test_type=None, limit=10):
        """Get quiz results with optional filters"""
        try:
            filters = {}
            if user_id:
                filters['user_id'] = user_id
            if test_type:
                filters['test_type'] = test_type
            
            results = self.mongodb_ops.get_quiz_results(filters=filters, limit=limit)
            return [
                QuizResultType(
                    id=result['_id'],
                    user_id=result['user_id'],
                    test_type=result['test_type'],
                    score=result['score'],
                    total_questions=result['total_questions'],
                    time_taken=result.get('time_taken'),
                    answers=result.get('answers', []),
                    created_at=result.get('created_at')
                )
                for result in results
            ]
        except Exception as e:
            print(f"Error resolving quiz results: {e}")
            return []
    
    def resolve_user_quiz_results(self, info, user_id):
        """Get all quiz results for a specific user"""
        return self.resolve_quiz_results(info, user_id=user_id, limit=100)
    
    # Profile resolvers
    def resolve_profile_details(self, info, user_id):
        """Get profile details for a user"""
        try:
            profile = self.mongodb_ops.get_profile_details(user_id)
            if profile:
                return ProfileDetailsType(
                    id=profile['_id'],
                    user_id=profile['user_id'],
                    phone=profile.get('phone'),
                    location=profile.get('location'),
                    institution=profile.get('institution'),
                    degree=profile.get('degree'),
                    graduation_year=profile.get('graduation_year'),
                    skills=profile.get('skills', []),
                    profile_picture=profile.get('profile_picture'),
                    updated_at=profile.get('updated_at')
                )
            return None
        except Exception as e:
            print(f"Error resolving profile details: {e}")
            return None
    
    # Career guidance resolvers
    def resolve_career_guidance(self, info, id):
        """Get career guidance by ID"""
        try:
            guidance = self.mongodb_ops.get_career_guidance_by_id(id)
            if guidance:
                return CareerGuidanceType(
                    id=guidance['_id'],
                    user_id=guidance['user_id'],
                    assessment_data=guidance.get('assessment_data'),
                    recommendations=guidance.get('recommendations', []),
                    career_path=guidance.get('career_path'),
                    skills_to_develop=guidance.get('skills_to_develop', []),
                    created_at=guidance.get('created_at')
                )
            return None
        except Exception as e:
            print(f"Error resolving career guidance: {e}")
            return None
    
    def resolve_user_career_guidance(self, info, user_id):
        """Get all career guidance for a user"""
        try:
            guidance_list = self.mongodb_ops.get_user_career_guidance(user_id)
            return [
                CareerGuidanceType(
                    id=guidance['_id'],
                    user_id=guidance['user_id'],
                    assessment_data=guidance.get('assessment_data'),
                    recommendations=guidance.get('recommendations', []),
                    career_path=guidance.get('career_path'),
                    skills_to_develop=guidance.get('skills_to_develop', []),
                    created_at=guidance.get('created_at')
                )
                for guidance in guidance_list
            ]
        except Exception as e:
            print(f"Error resolving user career guidance: {e}")
            return []
    
    # Statistics resolvers
    def resolve_user_stats(self, info, user_id):
        """Get statistics for a specific user"""
        try:
            stats = self.mongodb_ops.get_user_statistics(user_id)
            return StatsType(
                total_quiz_results=stats.get('total_quiz_results', 0),
                total_coding_solutions=stats.get('total_coding_solutions', 0),
                average_score=stats.get('average_score', 0.0),
                popular_tests=stats.get('popular_tests', [])
            )
        except Exception as e:
            print(f"Error resolving user stats: {e}")
            return StatsType(
                total_quiz_results=0,
                total_coding_solutions=0,
                average_score=0.0,
                popular_tests=[]
            )
    
    def resolve_global_stats(self, info):
        """Get global application statistics"""
        try:
            stats = self.mongodb_ops.get_global_statistics()
            return StatsType(
                total_users=stats.get('total_users', 0),
                total_quiz_results=stats.get('total_quiz_results', 0),
                total_coding_solutions=stats.get('total_coding_solutions', 0),
                average_score=stats.get('average_score', 0.0),
                popular_tests=stats.get('popular_tests', [])
            )
        except Exception as e:
            print(f"Error resolving global stats: {e}")
            return StatsType(
                total_users=0,
                total_quiz_results=0,
                total_coding_solutions=0,
                average_score=0.0,
                popular_tests=[]
            )
