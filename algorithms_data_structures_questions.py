"""
Algorithms & Data Structures Questions for the Interview Mentor application.
This module contains questions related to algorithms and data structures concepts.
"""

# List of algorithms and data structures questions
ALGORITHMS_DATA_STRUCTURES_QUESTIONS = [
    {
        "id": "algo_1",
        "question": "Which data structure uses a \"Last In, First Out\" (LIFO) principle?",
        "options": [
            "A) Queue",
            "B) Stack",
            "C) Linked List",
            "D) Binary Tree"
        ],
        "answer": "B) Stack",
        "explanation": "A stack follows the Last In, First Out (LIFO) principle, where the last element added is the first one to be removed."
    },
    {
        "id": "algo_2",
        "question": "What is the worst-case time complexity of the QuickSort algorithm?",
        "options": [
            "A) O(n log n)",
            "B) O(n²)",
            "C) O(n)",
            "D) O(log n)"
        ],
        "answer": "B) O(n²)",
        "explanation": "QuickSort has a worst-case time complexity of O(n²) when the pivot selection consistently results in highly unbalanced partitions."
    },
    {
        "id": "algo_3",
        "question": "In a binary search tree (BST), which property must hold true for all nodes?",
        "options": [
            "A) Left child is greater than the parent",
            "B) Right child is less than the parent",
            "C) Left child is less than the parent, right child is greater",
            "D) All nodes must have two children"
        ],
        "answer": "C) Left child is less than the parent, right child is greater",
        "explanation": "In a binary search tree, for every node, all values in its left subtree are less than the node's value, and all values in its right subtree are greater."
    },
    {
        "id": "algo_4",
        "question": "What is the primary advantage of using a hash table?",
        "options": [
            "A) Guaranteed sorted order",
            "B) Constant time complexity for lookups (O(1))",
            "C) Minimal memory usage",
            "D) Support for recursive operations"
        ],
        "answer": "B) Constant time complexity for lookups (O(1))",
        "explanation": "Hash tables provide constant time O(1) lookups on average, making them very efficient for retrieving data."
    },
    {
        "id": "algo_5",
        "question": "Which algorithm is used to find the shortest path in a weighted graph?",
        "options": [
            "A) Depth-First Search (DFS)",
            "B) Breadth-First Search (BFS)",
            "C) Dijkstra's Algorithm",
            "D) Merge Sort"
        ],
        "answer": "C) Dijkstra's Algorithm",
        "explanation": "Dijkstra's Algorithm is specifically designed to find the shortest path between nodes in a graph with non-negative edge weights."
    },
    {
        "id": "algo_6",
        "question": "What is the space complexity of a recursive algorithm that uses a call stack proportional to its input size?",
        "options": [
            "A) O(1)",
            "B) O(n)",
            "C) O(log n)",
            "D) O(n²)"
        ],
        "answer": "B) O(n)",
        "explanation": "If each recursive call adds a frame to the call stack proportional to the input size, the space complexity is O(n)."
    },
    {
        "id": "algo_7",
        "question": "In a singly linked list, what is the time complexity to access the last element?",
        "options": [
            "A) O(1)",
            "B) O(n)",
            "C) O(log n)",
            "D) O(n log n)"
        ],
        "answer": "B) O(n)",
        "explanation": "In a singly linked list, you must traverse all elements from the head to reach the last element, resulting in O(n) time complexity."
    },
    {
        "id": "algo_8",
        "question": "Which sorting algorithm has the best average-case time complexity of O(n log n) and is comparison-based?",
        "options": [
            "A) Bubble Sort",
            "B) Insertion Sort",
            "C) Merge Sort",
            "D) Selection Sort"
        ],
        "answer": "C) Merge Sort",
        "explanation": "Merge Sort consistently achieves O(n log n) time complexity in all cases and is a comparison-based sorting algorithm."
    },
    {
        "id": "algo_9",
        "question": "What is a \"heap\" data structure primarily used for?",
        "options": [
            "A) Storing sorted data",
            "B) Implementing priority queues",
            "C) Performing breadth-first traversal",
            "D) Hashing key-value pairs"
        ],
        "answer": "B) Implementing priority queues",
        "explanation": "Heaps are commonly used to implement priority queues because they efficiently maintain the highest (or lowest) priority element at the root."
    },
    {
        "id": "algo_10",
        "question": "Which traversal method visits the root node first in a binary tree?",
        "options": [
            "A) Inorder",
            "B) Preorder",
            "C) Postorder",
            "D) Level-order"
        ],
        "answer": "B) Preorder",
        "explanation": "Preorder traversal visits the root node first, then the left subtree, and finally the right subtree (Root-Left-Right)."
    }
]

def get_algorithms_data_structures_questions():
    """
    Returns all algorithms and data structures questions.
    
    Returns:
        list: A list of algorithms and data structures question dictionaries.
    """
    return ALGORITHMS_DATA_STRUCTURES_QUESTIONS 