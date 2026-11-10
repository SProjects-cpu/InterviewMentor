import os
import sys
from dotenv import load_dotenv

# 尝试导入google.generativeai模块
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
    print("Google Generative AI module is available")
except ImportError:
    GENAI_AVAILABLE = False
    print("Warning: Google Generative AI module is not available")
    print("Install with: pip install google-generativeai")

# 加载环境变量
load_dotenv()

# 获取API密钥
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY not found in .env file")
    sys.exit(1)

print(f"GEMINI_API_KEY found: {'[VALID KEY]' if GEMINI_API_KEY else '[MISSING]'}")

# 配置Gemini API
if GENAI_AVAILABLE:
    genai.configure(api_key=GEMINI_API_KEY)
    
    # 列出所有可用模型
    print("\n=== Available Gemini Models ===")
    try:
        for model in genai.list_models():
            if "generateContent" in model.supported_generation_methods:
                print(f"- {model.name} (支持generateContent方法)")
        
        print("\n推荐使用的模型:")
        print("- gemini-pro")
        print("- gemini-1.0-pro")
        print("- gemini-1.5-pro")
        print("- gemini-1.5-flash")
    except Exception as e:
        print(f"Error listing models: {e}")
else:
    print("Cannot list models: Google Generative AI module is not available")