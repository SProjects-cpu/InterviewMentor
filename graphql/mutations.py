import os
"""
GraphQL Mutations for Interview Mentor Application
Implements all mutation resolvers for data modification
"""

import graphene
from graphene import ObjectType, String, Int, Boolean, Field, Mutation
from datetime import datetime
import hashlib
import jwt
from typing import Optional, Dict, Any

from .types import (
    UserType, QuizResultType, CareerGuidanceType, ProfileDetailsType,
    UserSolutionType, AuthResponseType, MutationResponseType,
    UserInput, QuizResultInput, ProfileDetailsInput, CareerGuidanceInput,
    UserSolutionInput
)

# Import MongoDB operations
from database.mongodb_operations import get_mongodb_operations

# JWT configuration
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev-only-change-me")


class RegisterUser(Mutation):
    """Register a new user"""
    
    class Arguments:
        input = UserInput(required=True)
    
    Output = AuthResponseType
    
    def mutate(self, info, input):
        """Register user mutation"""
        try:
            mongodb_ops = get_mongodb_operations()
            
            # Check if user already exists
            existing_user = mongodb_ops.get_user_by_username(input.username)
            if existing_user:
                return AuthResponseType(
                    success=False,
                    message="Username already exists",
                    token=None,
                    user=None
                )
            
            # Hash password
            hashed_password = hashlib.sha256(input.password.encode()).hexdigest()
            
            # Create user data
            user_data = {
                '_id': input.username,
                'username': input.username,
                'password': hashed_password,
                'email': input.email,
                'created_at': datetime.utcnow()
            }
            
            # Save user
            result = mongodb_ops.create_user_with_data(user_data)
            if result:
                # Generate JWT token
                payload = {
                    'user_id': input.username,
                    'exp': datetime.utcnow().timestamp() + (24 * 3600)  # 24 hours
                }
                token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
                
                user = UserType(
                    id=input.username,
                    username=input.username,
                    email=input.email,
                    created_at=user_data['created_at']
                )
                
                return AuthResponseType(
                    success=True,
                    message="User registered successfully",
                    token=token,
                    user=user
                )
            else:
                return AuthResponseType(
                    success=False,
                    message="Failed to register user",
                    token=None,
                    user=None
                )
                
        except Exception as e:
            return AuthResponseType(
                success=False,
                message=f"Registration error: {str(e)}",
                token=None,
                user=None
            )


class LoginUser(Mutation):
    """Login user"""
    
    class Arguments:
        username = String(required=True)
        password = String(required=True)
    
    Output = AuthResponseType
    
    def mutate(self, info, username, password):
        """Login user mutation"""
        try:
            mongodb_ops = get_mongodb_operations()
            
            # Get user
            user = mongodb_ops.get_user_by_username(username)
            if not user:
                return AuthResponseType(
                    success=False,
                    message="Invalid username or password",
                    token=None,
                    user=None
                )
            
            # Verify password
            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            if user['password'] != hashed_password:
                return AuthResponseType(
                    success=False,
                    message="Invalid username or password",
                    token=None,
                    user=None
                )
            
            # Generate JWT token
            payload = {
                'user_id': username,
                'exp': datetime.utcnow().timestamp() + (24 * 3600)  # 24 hours
            }
            token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
            
            user_obj = UserType(
                id=user['_id'],
                username=user['username'],
                email=user.get('email'),
                created_at=user.get('created_at')
            )
            
            return AuthResponseType(
                success=True,
                message="Login successful",
                token=token,
                user=user_obj
            )
            
        except Exception as e:
            return AuthResponseType(
                success=False,
                message=f"Login error: {str(e)}",
                token=None,
                user=None
            )


class SaveQuizResult(Mutation):
    """Save quiz result"""
    
    class Arguments:
        user_id = String(required=True)
        input = QuizResultInput(required=True)
    
    Output = MutationResponseType
    
    def mutate(self, info, user_id, input):
        """Save quiz result mutation"""
        try:
            mongodb_ops = get_mongodb_operations()
            
            # Create quiz result data
            result_data = {
                'user_id': user_id,
                'test_type': input.test_type,
                'score': input.score,
                'total_questions': input.total_questions,
                'time_taken': input.time_taken,
                'answers': input.answers or [],
                'created_at': datetime.utcnow()
            }
            
            # Save quiz result
            result_id = mongodb_ops.save_quiz_result_with_data(result_data)
            if result_id:
                return MutationResponseType(
                    success=True,
                    message="Quiz result saved successfully",
                    id=result_id
                )
            else:
                return MutationResponseType(
                    success=False,
                    message="Failed to save quiz result",
                    id=None
                )
                
        except Exception as e:
            return MutationResponseType(
                success=False,
                message=f"Error saving quiz result: {str(e)}",
                id=None
            )


class UpdateProfile(Mutation):
    """Update user profile"""
    
    class Arguments:
        user_id = String(required=True)
        input = ProfileDetailsInput(required=True)
    
    Output = MutationResponseType
    
    def mutate(self, info, user_id, input):
        """Update profile mutation"""
        try:
            mongodb_ops = get_mongodb_operations()
            
            # Create profile data
            profile_data = {
                'user_id': user_id,
                'phone': input.phone,
                'location': input.location,
                'institution': input.institution,
                'degree': input.degree,
                'graduation_year': input.graduation_year,
                'skills': input.skills or [],
                'profile_picture': input.profile_picture,
                'updated_at': datetime.utcnow()
            }
            
            # Update profile
            result = mongodb_ops.update_profile_details(user_id, profile_data)
            if result:
                return MutationResponseType(
                    success=True,
                    message="Profile updated successfully",
                    id=user_id
                )
            else:
                return MutationResponseType(
                    success=False,
                    message="Failed to update profile",
                    id=None
                )
                
        except Exception as e:
            return MutationResponseType(
                success=False,
                message=f"Error updating profile: {str(e)}",
                id=None
            )


class SaveCareerGuidance(Mutation):
    """Save career guidance"""
    
    class Arguments:
        user_id = String(required=True)
        input = CareerGuidanceInput(required=True)
    
    Output = MutationResponseType
    
    def mutate(self, info, user_id, input):
        """Save career guidance mutation"""
        try:
            mongodb_ops = get_mongodb_operations()
            
            # Create career guidance data
            guidance_data = {
                'user_id': user_id,
                'assessment_data': input.assessment_data,
                'recommendations': input.recommendations or [],
                'career_path': input.career_path,
                'skills_to_develop': input.skills_to_develop or [],
                'created_at': datetime.utcnow()
            }
            
            # Save career guidance
            result_id = mongodb_ops.save_career_guidance(guidance_data)
            if result_id:
                return MutationResponseType(
                    success=True,
                    message="Career guidance saved successfully",
                    id=result_id
                )
            else:
                return MutationResponseType(
                    success=False,
                    message="Failed to save career guidance",
                    id=None
                )
                
        except Exception as e:
            return MutationResponseType(
                success=False,
                message=f"Error saving career guidance: {str(e)}",
                id=None
            )


class SubmitCodingSolution(Mutation):
    """Submit coding solution"""
    
    class Arguments:
        user_id = String(required=True)
        input = UserSolutionInput(required=True)
    
    Output = MutationResponseType
    
    def mutate(self, info, user_id, input):
        """Submit coding solution mutation"""
        try:
            mongodb_ops = get_mongodb_operations()
            
            # Create solution data
            solution_data = {
                'user_id': user_id,
                'challenge_id': input.challenge_id,
                'code': input.code,
                'language': input.language,
                'status': 'submitted',
                'submitted_at': datetime.utcnow()
            }
            
            # Save solution
            result_id = mongodb_ops.save_user_solution(solution_data)
            if result_id:
                return MutationResponseType(
                    success=True,
                    message="Solution submitted successfully",
                    id=result_id
                )
            else:
                return MutationResponseType(
                    success=False,
                    message="Failed to submit solution",
                    id=None
                )
                
        except Exception as e:
            return MutationResponseType(
                success=False,
                message=f"Error submitting solution: {str(e)}",
                id=None
            )


class Mutation(ObjectType):
    """Root Mutation class"""
    
    # Authentication mutations
    register_user = RegisterUser.Field()
    login_user = LoginUser.Field()
    
    # Quiz mutations
    save_quiz_result = SaveQuizResult.Field()
    
    # Profile mutations
    update_profile = UpdateProfile.Field()
    
    # Career guidance mutations
    save_career_guidance = SaveCareerGuidance.Field()
    
    # Coding mutations
    submit_coding_solution = SubmitCodingSolution.Field()
