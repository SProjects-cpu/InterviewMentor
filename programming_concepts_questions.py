"""
Programming Concepts Questions for the Interview Mentor application.
This module contains questions related to programming fundamentals.
"""

# List of programming concepts questions
PROGRAMMING_CONCEPTS_QUESTIONS = [
    {
        "id": "prog_1",
        "question": "What is the primary purpose of a variable in programming?",
        "options": [
            "A) To store data temporarily",
            "B) To execute loops",
            "C) To define functions",
            "D) To create classes"
        ],
        "answer": "A) To store data temporarily",
        "explanation": "Variables are used to store data values that can be used and manipulated throughout a program."
    },
    {
        "id": "prog_2",
        "question": "Which of these is NOT a primitive data type in most programming languages?",
        "options": [
            "A) Integer",
            "B) Boolean",
            "C) String",
            "D) Array"
        ],
        "answer": "D) Array",
        "explanation": "Arrays are composite data structures that can hold multiple values, while integers, booleans, and strings are primitive data types."
    },
    {
        "id": "prog_3",
        "question": "What does \"OOP\" stand for in programming?",
        "options": [
            "A) Object-Oriented Programming",
            "B) Operational Order Processing",
            "C) Optimized Output Protocol",
            "D) Overloaded Operator Programming"
        ],
        "answer": "A) Object-Oriented Programming",
        "explanation": "OOP stands for Object-Oriented Programming, which is a programming paradigm based on the concept of objects that contain data and code."
    },
    {
        "id": "prog_4",
        "question": "In a conditional statement, what keyword is commonly used to specify an alternative condition?",
        "options": [
            "A) for",
            "B) else",
            "C) while",
            "D) switch"
        ],
        "answer": "B) else",
        "explanation": "The 'else' keyword is used to specify a block of code to be executed if the condition in the 'if' statement is false."
    },
    {
        "id": "prog_5",
        "question": "What is the time complexity of a binary search algorithm?",
        "options": [
            "A) O(n)",
            "B) O(log n)",
            "C) O(n²)",
            "D) O(1)"
        ],
        "answer": "B) O(log n)",
        "explanation": "Binary search has a time complexity of O(log n) because it divides the search interval in half with each step."
    },
    {
        "id": "prog_6",
        "question": "Which loop structure executes at least once regardless of the condition?",
        "options": [
            "A) for loop",
            "B) while loop",
            "C) do-while loop",
            "D) foreach loop"
        ],
        "answer": "C) do-while loop",
        "explanation": "A do-while loop always executes its body at least once before checking the condition."
    },
    {
        "id": "prog_7",
        "question": "What is the purpose of the \"return\" statement in a function?",
        "options": [
            "A) To terminate the program",
            "B) To send a value back to the caller",
            "C) To declare a variable",
            "D) To start a loop"
        ],
        "answer": "B) To send a value back to the caller",
        "explanation": "The return statement is used to exit a function and return a value to the caller."
    },
    {
        "id": "prog_8",
        "question": "In Python, how do you denote a single-line comment?",
        "options": [
            "A) //",
            "B) #",
            "C) /",
            "D) -->"
        ],
        "answer": "B) #",
        "explanation": "In Python, the '#' symbol is used to start a single-line comment."
    },
    {
        "id": "prog_9",
        "question": "What does \"API\" stand for in the context of software development?",
        "options": [
            "A) Application Programming Interface",
            "B) Automated Process Integration",
            "C) Advanced Programming Instruction",
            "D) Algorithmic Performance Indicator"
        ],
        "answer": "A) Application Programming Interface",
        "explanation": "API stands for Application Programming Interface, which defines how different software components should interact."
    },
    {
        "id": "prog_10",
        "question": "Which of these is a key feature of recursion?",
        "options": [
            "A) A function calling itself",
            "B) Multiple threads running simultaneously",
            "C) Static variable allocation",
            "D) Constant time complexity"
        ],
        "answer": "A) A function calling itself",
        "explanation": "Recursion is a programming technique where a function calls itself to solve a problem."
    },
    {
        "id": "prog_11",
        "question": "What is the purpose of a \"try-catch\" block?",
        "options": [
            "A) To define a loop",
            "B) To handle exceptions",
            "C) To declare classes",
            "D) To optimize memory usage"
        ],
        "answer": "B) To handle exceptions",
        "explanation": "Try-catch blocks are used to handle exceptions or errors that might occur during program execution."
    },
    {
        "id": "prog_12",
        "question": "In JavaScript, which method is used to add an element to the end of an array?",
        "options": [
            "A) append()",
            "B) push()",
            "C) add()",
            "D) insert()"
        ],
        "answer": "B) push()",
        "explanation": "In JavaScript, the push() method adds one or more elements to the end of an array."
    },
    {
        "id": "prog_13",
        "question": "What is \"inheritance\" in object-oriented programming?",
        "options": [
            "A) A class reusing properties and methods of another class",
            "B) A method overriding another method",
            "C) A variable storing multiple values",
            "D) A loop running indefinitely"
        ],
        "answer": "A) A class reusing properties and methods of another class",
        "explanation": "Inheritance is a mechanism where a new class inherits properties and behaviors from an existing class."
    },
    {
        "id": "prog_14",
        "question": "Which data structure operates on a \"First In, First Out\" (FIFO) principle?",
        "options": [
            "A) Stack",
            "B) Queue",
            "C) Heap",
            "D) Tree"
        ],
        "answer": "B) Queue",
        "explanation": "A queue follows the First In, First Out (FIFO) principle, where the first element added is the first one to be removed."
    },
    {
        "id": "prog_15",
        "question": "What does \"SQL\" stand for?",
        "options": [
            "A) Structured Query Language",
            "B) Simple Query Logic",
            "C) System Quality Level",
            "D) Sequential Query Layer"
        ],
        "answer": "A) Structured Query Language",
        "explanation": "SQL stands for Structured Query Language, which is used for managing and manipulating relational databases."
    }
]

def get_programming_concepts_questions():
    """
    Returns all programming concepts questions.
    
    Returns:
        list: A list of programming concepts question dictionaries.
    """
    return PROGRAMMING_CONCEPTS_QUESTIONS 