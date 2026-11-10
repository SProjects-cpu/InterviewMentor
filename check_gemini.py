import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY not found in .env file")
    sys.exit(1)

print(f"GEMINI_API_KEY found: {'[VALID KEY]' if GEMINI_API_KEY else '[MISSING]'}")

try:
    import google.generativeai as genai
    print("Successfully imported google.generativeai module")
except ImportError:
    print("Error: google.generativeai module not found. Please install it with:")
    print("pip install google-generativeai==0.3.1")
    sys.exit(1)

# Configure Gemini API
try:
    genai.configure(api_key=GEMINI_API_KEY)
    print("Successfully configured Gemini API")
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    sys.exit(1)

# Check available models
try:
    models = genai.list_models()
    gemini_models = [model.name for model in models if "gemini" in model.name.lower()]
    print(f"Available Gemini models: {gemini_models}")
    
    # Check if Gemini 1.5 Flash is available
    if any("gemini-1.5-flash" in model for model in gemini_models):
        print("Gemini 1.5 Flash model is available!")
    else:
        print("Warning: Gemini 1.5 Flash model not found in available models")
except Exception as e:
    print(f"Error listing models: {e}")
    sys.exit(1)

# Test a simple prompt with Gemini 1.5 Flash
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello, are you Gemini 1.5 Flash?")
    print("\nTest response from Gemini 1.5 Flash:")
    print(response.text)
    print("\nGemini API is working correctly!")
except Exception as e:
    print(f"Error testing Gemini API: {e}")
    sys.exit(1) 