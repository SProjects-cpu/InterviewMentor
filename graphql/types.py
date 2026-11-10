"""
GraphQL Types for Interview Mentor Application
Defines all GraphQL types based on MongoDB collections
"""

import graphene
from graphene import ObjectType, String, Int, Float, Boolean, DateTime, List, Field
from datetime import datetime
from typing import Optional, Dict, Any


class UserType(ObjectType):
    """User GraphQL type"""
    id = String(required=True)
    username = String(required=True)
    email = String()
    created_at = DateTime()


class QuizResultType(ObjectType):
    """Quiz Result GraphQL type"""
    id = String(required=True)
    user_id = String(required=True)
    test_type = String(required=True)
    score = Int(required=True)
    total_questions = Int(required=True)
    time_taken = Int()  # in seconds
    answers = List(String)
    created_at = DateTime()
    
    # Computed fields
    percentage = Float()
    
    def resolve_percentage(self, info):
        """Calculate percentage score"""
        if self.total_questions > 0:
            return (self.score / self.total_questions) * 100
        return 0.0


class CareerGuidanceType(ObjectType):
    """Career Guidance GraphQL type"""
    id = String(required=True)
    user_id = String(required=True)
    assessment_data = String()  # JSON string
    recommendations = List(String)
    career_path = String()
    skills_to_develop = List(String)
    created_at = DateTime()


class ProfileDetailsType(ObjectType):
    """Profile Details GraphQL type"""
    id = String(required=True)
    user_id = String(required=True)
    phone = String()
    location = String()
    institution = String()
    degree = String()
    graduation_year = Int()
    skills = List(String)
    profile_picture = String()
    updated_at = DateTime()


class UserSessionType(ObjectType):
    """User Session GraphQL type"""
    id = String(required=True)
    user_id = String(required=True)
    session_token = String(required=True)
    created_at = DateTime()
    expires_at = DateTime()
    is_active = Boolean()


class CodingChallengeType(ObjectType):
    """Coding Challenge GraphQL type"""
    id = String(required=True)
    title = String(required=True)
    description = String(required=True)
    difficulty = String(required=True)
    language = String(required=True)
    starter_code = String()
    test_cases = List(String)
    created_at = DateTime()


class UserSolutionType(ObjectType):
    """User Solution GraphQL type"""
    id = String(required=True)
    user_id = String(required=True)
    challenge_id = String(required=True)
    code = String(required=True)
    language = String(required=True)
    status = String()  # 'submitted', 'passed', 'failed'
    execution_time = Float()
    memory_usage = Int()
    ai_review = String()
    score = Int()
    submitted_at = DateTime()


# Input Types for Mutations
class UserInput(graphene.InputObjectType):
    """User input for mutations"""
    username = String(required=True)
    password = String(required=True)
    email = String()


class QuizResultInput(graphene.InputObjectType):
    """Quiz result input for mutations"""
    test_type = String(required=True)
    score = Int(required=True)
    total_questions = Int(required=True)
    time_taken = Int()
    answers = List(String)


class ProfileDetailsInput(graphene.InputObjectType):
    """Profile details input for mutations"""
    phone = String()
    location = String()
    institution = String()
    degree = String()
    graduation_year = Int()
    skills = List(String)
    profile_picture = String()


class CareerGuidanceInput(graphene.InputObjectType):
    """Career guidance input for mutations"""
    assessment_data = String(required=True)
    recommendations = List(String)
    career_path = String()
    skills_to_develop = List(String)


class UserSolutionInput(graphene.InputObjectType):
    """User solution input for mutations"""
    challenge_id = String(required=True)
    code = String(required=True)
    language = String(required=True)


# Response Types
class AuthResponseType(ObjectType):
    """Authentication response type"""
    success = Boolean(required=True)
    message = String()
    token = String()
    user = Field(UserType)


class MutationResponseType(ObjectType):
    """Generic mutation response type"""
    success = Boolean(required=True)
    message = String()
    id = String()


class StatsType(ObjectType):
    """Statistics type for dashboard"""
    total_users = Int()
    total_quiz_results = Int()
    total_coding_solutions = Int()
    average_score = Float()
    popular_tests = List(String)


class TestCategoryType(ObjectType):
    """Test category type"""
    id = String(required=True)
    name = String(required=True)
    description = String()
    icon = String()
    color = String()
    test_count = Int()


class TestType(ObjectType):
    """Individual test type"""
    id = String(required=True)
    name = String(required=True)
    description = String()
    questions = Int()
    time = Int()  # in minutes
    difficulty = String()
    category_id = String()
