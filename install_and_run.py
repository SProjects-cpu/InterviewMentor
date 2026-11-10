import subprocess
import sys
import os

def install_dependencies():
    print("Installing Flask and dependencies...")
    packages = [
        "flask==2.0.1",
        "flask-login==0.5.0",
        "flask-session==0.4.0",
        "flask-wtf==0.15.1",
        "werkzeug==2.0.1",
        "python-dotenv==0.19.0",
        "google-generativeai==0.3.0"
    ]
    
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install"] + packages)
        print("Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError:
        print("Failed to install dependencies.")
        return False

def check_flask_installed():
    try:
        import flask
        print(f"Flask is installed! Version: {flask.__version__}")
        return True
    except ImportError:
        print("Flask is NOT installed!")
        return False

def run_app():
    print("Starting the application...")
    try:
        subprocess.check_call([sys.executable, "app.py"])
    except subprocess.CalledProcessError:
        print("Failed to run the application.")

if __name__ == "__main__":
    if install_dependencies():
        if check_flask_installed():
            run_app()
        else:
            print("Flask installation failed. Cannot run the application.")
    else:
        print("Dependency installation failed. Cannot run the application.")
    
    input("Press Enter to exit...") 