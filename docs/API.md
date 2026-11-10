# API Documentation

## Authentication Endpoints

### POST /api/auth/login
Authenticates a user and returns a session token.

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "status": "success",
    "token": "session_token_here",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe"
    }
}
```

### POST /api/auth/register
Registers a new user.

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
}
```

## Coding Test Endpoints

### POST /api/execute-code
Executes code and returns results with AI review.

**Request Body:**
```json
{
    "code": "print('Hello, World!')",
    "language": "python",
    "challenge_id": "123"
}
```

**Response:**
```json
{
    "status": "success",
    "output": "Hello, World!",
    "ai_review": {
        "feedback": "Your code is correct and follows good practices.",
        "suggestions": ["Consider adding comments", "Add error handling"]
    }
}
```

### GET /api/challenges
Returns list of available coding challenges.

**Response:**
```json
{
    "challenges": [
        {
            "id": "123",
            "title": "String Reversal",
            "difficulty": "Easy",
            "description": "Write a function to reverse a string"
        }
    ]
}
```

## Resume Builder Endpoints

### POST /api/resume/save
Saves or updates a resume.

**Request Body:**
```json
{
    "personal_info": {
        "name": "John Doe",
        "email": "john@example.com"
    },
    "experience": [],
    "education": []
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
    "status": "error",
    "message": "Invalid input parameters"
}
```

### 401 Unauthorized
```json
{
    "status": "error",
    "message": "Authentication required"
}
```

### 500 Server Error
```json
{
    "status": "error",
    "message": "Internal server error"
}
```