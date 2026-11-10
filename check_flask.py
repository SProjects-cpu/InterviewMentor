try:
    import flask
    print("Flask is installed!")
    print(f"Flask version: {flask.__version__}")
except ImportError:
    print("Flask is NOT installed!")

try:
    import flask_login
    print("Flask-Login is installed!")
    print(f"Flask-Login version: {flask_login.__version__}")
except ImportError:
    print("Flask-Login is NOT installed!")

try:
    import flask_session
    print("Flask-Session is installed!")
except ImportError:
    print("Flask-Session is NOT installed!")

try:
    import flask_wtf
    print("Flask-WTF is installed!")
    print(f"Flask-WTF version: {flask_wtf.__version__}")
except ImportError:
    print("Flask-WTF is NOT installed!")

try:
    import werkzeug
    print("Werkzeug is installed!")
    print(f"Werkzeug version: {werkzeug.__version__}")
except ImportError:
    print("Werkzeug is NOT installed!")

try:
    import dotenv
    print("python-dotenv is installed!")
    print(f"python-dotenv version: {dotenv.__version__}")
except ImportError:
    print("python-dotenv is NOT installed!")

try:
    import google.generativeai
    print("google-generativeai is installed!")
except ImportError:
    print("google-generativeai is NOT installed!")

print("\nPython path:")
import sys
for path in sys.path:
    print(path) 