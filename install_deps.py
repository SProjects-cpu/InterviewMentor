import subprocess
import sys
import os

def install_dependencies():
    print("Installing required dependencies for Interview Mentor...")
    
    # List of required packages
    packages = [
        "flask==2.3.3",
        "flask-login==0.6.2",
        "flask-session==0.4.0",
        "flask-wtf==0.15.1",
        "google-generativeai==0.3.1",
        "reportlab==4.0.4",
        "sentence-transformers==2.2.2",
        "transformers==4.30.2",
        "torch==2.0.1",
        "Werkzeug==2.3.7",
        "Pillow==10.0.0",
        "python-dotenv==1.0.0"
    ]
    
    # Install each package
    for package in packages:
        print(f"Installing {package}...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"Successfully installed {package}")
        except subprocess.CalledProcessError:
            print(f"Failed to install {package}")
    
    print("\nDependencies installation completed!")

if __name__ == "__main__":
    install_dependencies() 