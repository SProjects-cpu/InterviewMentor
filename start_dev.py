#!/usr/bin/env python3
"""
Development server startup script for Interview Mentor
Starts both the Flask API backend and Next.js frontend
"""

import subprocess
import sys
import os
import time
import threading

def start_backend():
    """Start the Flask API backend"""
    print("🚀 Starting Flask API backend on port 5000...")
    try:
        # Install backend dependencies if needed
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
        
        # Start the Flask API
        subprocess.run([sys.executable, "api_app.py"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting backend: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n🛑 Backend stopped by user")

def start_frontend():
    """Start the Next.js frontend"""
    print("🚀 Starting Next.js frontend on port 3000...")
    try:
        # Change to frontend directory
        os.chdir("frontend")
        
        # Install frontend dependencies if needed
        if not os.path.exists("node_modules"):
            print("📦 Installing frontend dependencies...")
            subprocess.run(["npm", "install"], check=True)
        
        # Start the Next.js development server
        subprocess.run(["npm", "run", "dev"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting frontend: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n🛑 Frontend stopped by user")

def main():
    """Main function to start both servers"""
    print("🎯 Interview Mentor Development Server")
    print("=" * 50)
    
    # Create threads for backend and frontend
    backend_thread = threading.Thread(target=start_backend, daemon=True)
    frontend_thread = threading.Thread(target=start_frontend, daemon=True)
    
    try:
        # Start backend first
        backend_thread.start()
        time.sleep(3)  # Give backend time to start
        
        # Start frontend
        frontend_thread.start()
        
        print("\n✅ Both servers are starting...")
        print("📍 Backend API: http://localhost:5000")
        print("📍 Frontend: http://localhost:3000")
        print("\nPress Ctrl+C to stop both servers")
        
        # Keep main thread alive
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        sys.exit(0)

if __name__ == "__main__":
    main()
