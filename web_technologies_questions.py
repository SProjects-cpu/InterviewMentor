"""
Web Technologies Questions for the Interview Mentor application.
This module contains questions related to web development technologies.
"""

# List of web technologies questions
WEB_TECHNOLOGIES_QUESTIONS = [
    {
        "id": "web_1",
        "question": "What does HTML stand for?",
        "options": [
            "HyperText Markup Language",
            "High-Tech Modern Language",
            "Hyperlink Text Management Language",
            "Home Tool Markup Language"
        ],
        "answer": "HyperText Markup Language",
        "explanation": "HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser."
    },
    {
        "id": "web_2",
        "question": "Which protocol is primarily used to transfer web pages over the internet?",
        "options": [
            "FTP (File Transfer Protocol)",
            "SMTP (Simple Mail Transfer Protocol)",
            "HTTP (HyperText Transfer Protocol)",
            "SSH (Secure Shell)"
        ],
        "answer": "HTTP (HyperText Transfer Protocol)",
        "explanation": "HTTP is the foundation of data communication on the World Wide Web, used for transferring web pages and other resources."
    },
    {
        "id": "web_3",
        "question": "What is the purpose of CSS in web development?",
        "options": [
            "To create interactive web forms",
            "To style and format the appearance of web pages",
            "To handle server-side logic",
            "To manage database connections"
        ],
        "answer": "To style and format the appearance of web pages",
        "explanation": "CSS (Cascading Style Sheets) is used to style and format the appearance of web pages, such as colors, fonts, and layouts."
    },
    {
        "id": "web_4",
        "question": "Which JavaScript framework, developed by Facebook, is commonly used for building user interfaces?",
        "options": [
            "Angular",
            "Vue",
            "React",
            "Ember"
        ],
        "answer": "React",
        "explanation": "React is a JavaScript library developed by Facebook for building user interfaces, particularly single-page applications."
    },
    {
        "id": "web_5",
        "question": "What is the default port number for HTTPS?",
        "options": [
            "80",
            "443",
            "8080",
            "21"
        ],
        "answer": "443",
        "explanation": "HTTPS (HTTP Secure) uses port 443 by default for secure communication over a computer network."
    },
    {
        "id": "web_6",
        "question": "Which HTML tag is used to define an unordered list?",
        "options": [
            "<ol>",
            "<li>",
            "<ul>",
            "<dl>"
        ],
        "answer": "<ul>",
        "explanation": "The <ul> (Unordered List) tag is used to create a bulleted list in HTML."
    },
    {
        "id": "web_7",
        "question": "What does the acronym API stand for in the context of web development?",
        "options": [
            "Application Programming Interface",
            "Advanced Programming Integration",
            "Automated Program Instruction",
            "Application Process Integration"
        ],
        "answer": "Application Programming Interface",
        "explanation": "An API (Application Programming Interface) defines interactions between multiple software applications or mixed hardware-software intermediaries."
    },
    {
        "id": "web_8",
        "question": "Which of the following is NOT a valid HTTP status code: 200, 404, 500, 999?",
        "options": [
            "200",
            "404",
            "500",
            "999"
        ],
        "answer": "999",
        "explanation": "999 is not a standard HTTP status code. The standard codes include 200 (OK), 404 (Not Found), and 500 (Internal Server Error)."
    },
    {
        "id": "web_9",
        "question": "What technology is used to make websites interactive and dynamic by manipulating the DOM?",
        "options": [
            "HTML",
            "CSS",
            "JavaScript",
            "XML"
        ],
        "answer": "JavaScript",
        "explanation": "JavaScript is the programming language that allows developers to create dynamic content, control multimedia, and manipulate the DOM (Document Object Model)."
    },
    {
        "id": "web_10",
        "question": "In CSS, what property is used to change the text color of an element?",
        "options": [
            "text-color",
            "font-color",
            "color",
            "text-style"
        ],
        "answer": "color",
        "explanation": "The 'color' property in CSS is used to set the color of text content in an element."
    },
    {
        "id": "web_11",
        "question": "Which web technology is used to store data on the client side, such as in cookies or localStorage?",
        "options": [
            "HTML",
            "CSS",
            "JavaScript",
            "PHP"
        ],
        "answer": "JavaScript",
        "explanation": "JavaScript provides browser APIs like localStorage, sessionStorage, and document.cookie to store data on the client side."
    },
    {
        "id": "web_12",
        "question": "What does the `<meta charset=\"UTF-8\">` tag in HTML do?",
        "options": [
            "It specifies the character encoding for the document",
            "It defines the metadata for search engines",
            "It sets the language of the document",
            "It controls the viewport settings for mobile devices"
        ],
        "answer": "It specifies the character encoding for the document",
        "explanation": "The meta charset tag specifies the character encoding for the HTML document, ensuring proper display of special characters."
    },
    {
        "id": "web_13",
        "question": "Which backend framework, written in Python, is known for its \"batteries-included\" philosophy?",
        "options": [
            "Flask",
            "Express",
            "Django",
            "Ruby on Rails"
        ],
        "answer": "Django",
        "explanation": "Django is a high-level Python web framework that follows the 'batteries-included' philosophy, providing many built-in features."
    },
    {
        "id": "web_14",
        "question": "What is the purpose of the `alt` attribute in an `<img>` tag?",
        "options": [
            "It provides alternative text for an image",
            "It specifies the alignment of the image",
            "It defines the alternative source if the image fails to load",
            "It controls the animation of the image"
        ],
        "answer": "It provides alternative text for an image",
        "explanation": "The alt attribute provides alternative text for an image, used for accessibility or if the image fails to load."
    },
    {
        "id": "web_15",
        "question": "Which of these is a popular version control system used in web development: Git, FTP, SMTP, or DNS?",
        "options": [
            "Git",
            "FTP",
            "SMTP",
            "DNS"
        ],
        "answer": "Git",
        "explanation": "Git is a distributed version control system widely used in web development to track changes in source code during software development."
    }
]

def get_web_technologies_questions():
    """
    Returns all web technologies questions.
    
    Returns:
        list: A list of web technologies question dictionaries.
    """
    return WEB_TECHNOLOGIES_QUESTIONS 