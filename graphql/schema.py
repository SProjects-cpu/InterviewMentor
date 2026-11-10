"""
GraphQL Schema for Interview Mentor Application
Main schema definition combining queries and mutations
"""

import graphene
from .queries import Query
from .mutations import Mutation


# Create the main GraphQL schema
schema = graphene.Schema(
    query=Query,
    mutation=Mutation,
    auto_camelcase=False  # Keep field names as they are
)


def get_schema():
    """Get the GraphQL schema instance"""
    return schema


# Schema introspection for development
def get_schema_definition():
    """Get schema definition as string for documentation"""
    return str(schema)


# Example queries for testing
EXAMPLE_QUERIES = {
    "get_user": """
    query GetUser($id: String!) {
        user(id: $id) {
            id
            username
            email
            createdAt
        }
    }
    """,
    
    "get_users": """
    query GetUsers($limit: Int, $offset: Int) {
        users(limit: $limit, offset: $offset) {
            id
            username
            email
            createdAt
        }
    }
    """,
    
    "get_quiz_results": """
    query GetQuizResults($userId: String, $testType: String, $limit: Int) {
        quizResults(userId: $userId, testType: $testType, limit: $limit) {
            id
            userId
            testType
            score
            totalQuestions
            percentage
            timeTaken
            createdAt
        }
    }
    """,
    
    "get_profile": """
    query GetProfile($userId: String!) {
        profileDetails(userId: $userId) {
            id
            userId
            phone
            location
            institution
            degree
            graduationYear
            skills
            profilePicture
            updatedAt
        }
    }
    """,
    
    "get_user_stats": """
    query GetUserStats($userId: String!) {
        userStats(userId: $userId) {
            totalQuizResults
            totalCodingSolutions
            averageScore
            popularTests
        }
    }
    """,
    
    "get_global_stats": """
    query GetGlobalStats {
        globalStats {
            totalUsers
            totalQuizResults
            totalCodingSolutions
            averageScore
            popularTests
        }
    }
    """
}

EXAMPLE_MUTATIONS = {
    "register_user": """
    mutation RegisterUser($input: UserInput!) {
        registerUser(input: $input) {
            success
            message
            token
            user {
                id
                username
                email
                createdAt
            }
        }
    }
    """,
    
    "login_user": """
    mutation LoginUser($username: String!, $password: String!) {
        loginUser(username: $username, password: $password) {
            success
            message
            token
            user {
                id
                username
                email
                createdAt
            }
        }
    }
    """,
    
    "save_quiz_result": """
    mutation SaveQuizResult($userId: String!, $input: QuizResultInput!) {
        saveQuizResult(userId: $userId, input: $input) {
            success
            message
            id
        }
    }
    """,
    
    "update_profile": """
    mutation UpdateProfile($userId: String!, $input: ProfileDetailsInput!) {
        updateProfile(userId: $userId, input: $input) {
            success
            message
            id
        }
    }
    """,
    
    "save_career_guidance": """
    mutation SaveCareerGuidance($userId: String!, $input: CareerGuidanceInput!) {
        saveCareerGuidance(userId: $userId, input: $input) {
            success
            message
            id
        }
    }
    """,
    
    "submit_coding_solution": """
    mutation SubmitCodingSolution($userId: String!, $input: UserSolutionInput!) {
        submitCodingSolution(userId: $userId, input: $input) {
            success
            message
            id
        }
    }
    """
}


def get_example_queries():
    """Get example queries for testing"""
    return EXAMPLE_QUERIES


def get_example_mutations():
    """Get example mutations for testing"""
    return EXAMPLE_MUTATIONS


# Schema validation
def validate_schema():
    """Validate the GraphQL schema"""
    try:
        # Try to create the schema
        test_schema = graphene.Schema(query=Query, mutation=Mutation)
        return True, "Schema is valid"
    except Exception as e:
        return False, f"Schema validation error: {str(e)}"


# Development helpers
def print_schema_info():
    """Print schema information for development"""
    print("=== GraphQL Schema Information ===")
    print(f"Query fields: {list(Query._meta.fields.keys())}")
    print(f"Mutation fields: {list(Mutation._meta.fields.keys())}")
    
    is_valid, message = validate_schema()
    print(f"Schema valid: {is_valid}")
    if not is_valid:
        print(f"Validation error: {message}")
    
    print("\n=== Example Queries ===")
    for name, query in EXAMPLE_QUERIES.items():
        print(f"\n{name}:")
        print(query.strip())
    
    print("\n=== Example Mutations ===")
    for name, mutation in EXAMPLE_MUTATIONS.items():
        print(f"\n{name}:")
        print(mutation.strip())


if __name__ == "__main__":
    print_schema_info()
