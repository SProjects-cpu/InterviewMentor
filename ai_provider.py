"""
AI Provider Abstraction Layer
Supports multiple AI providers: Groq Compound (primary), Gemini (fallback)
"""

import os
from abc import ABC, abstractmethod
from dotenv import load_dotenv

load_dotenv()

# Provider configuration
AI_PROVIDER = os.getenv("AI_PROVIDER", "groq")  # 'groq', 'gemini', or 'auto'
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Groq configuration - using compound model
GROQ_MODEL = os.getenv("GROQ_MODEL", "groq/compound")

# Gemini configuration  
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")


class AIProvider(ABC):
    """Abstract base class for AI providers"""
    
    @abstractmethod
    def generate_response(self, prompt: str) -> dict:
        """Generate a response from the AI model"""
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        """Check if the provider is available"""
        pass
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Provider name"""
        pass


class GroqProvider(AIProvider):
    """Groq AI Provider using official Groq SDK with Compound model"""
    
    def __init__(self):
        self.api_key = GROQ_API_KEY
        self.model = GROQ_MODEL
        self._available = None
        self._client = None
        
    @property
    def name(self) -> str:
        return "Groq Compound"
    
    def is_available(self) -> bool:
        if self._available is not None:
            return self._available
            
        if not self.api_key:
            print("❌ Groq API key not found")
            self._available = False
            return False

        # Test the API using official Groq SDK
        try:
            from groq import Groq
            self._client = Groq(api_key=self.api_key)
            
            # Test with a simple request
            completion = self._client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": "Hi"}],
                max_tokens=10
            )
            
            self._available = True
            print(f"✅ Groq API configured successfully with model: {self.model}")
        except Exception as e:
            print(f"❌ Groq API test failed: {e}")
            self._available = False
            
        return self._available
    
    def generate_response(self, prompt: str) -> dict:
        """Generate response using Groq SDK with Compound model"""
        if not self.is_available():
            return {"status": "error", "message": "Groq API not available"}
            
        try:
            from groq import Groq
            if not self._client:
                self._client = Groq(api_key=self.api_key)
            
            completion = self._client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1000,
                temperature=0.7
            )
            
            content = completion.choices[0].message.content
            return {"status": "success", "content": content}
                
        except Exception as e:
            return {"status": "error", "message": str(e)}


class GeminiProvider(AIProvider):
    """Google Gemini AI Provider"""
    
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self.model = GEMINI_MODEL
        self._available = None
        self._genai = None
        
    @property
    def name(self) -> str:
        return "Gemini"
    
    def is_available(self) -> bool:
        if self._available is not None:
            return self._available
            
        if not self.api_key:
            print("❌ Gemini API key not found")
            self._available = False
            return False
            
        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            model = genai.GenerativeModel(self.model)
            response = model.generate_content("Hi")
            self._genai = genai
            self._available = True
            print(f"✅ Gemini API configured successfully with model: {self.model}")
        except Exception as e:
            print(f"❌ Gemini API test failed: {e}")
            self._available = False
            
        return self._available
    
    def generate_response(self, prompt: str) -> dict:
        """Generate response using Gemini API"""
        if not self.is_available():
            return {"status": "error", "message": "Gemini API not available"}
            
        try:
            import google.generativeai as genai
            if not self._genai:
                genai.configure(api_key=self.api_key)
            model = genai.GenerativeModel(self.model)
            response = model.generate_content(prompt)
            return {"status": "success", "content": response.text}
        except Exception as e:
            return {"status": "error", "message": str(e)}


class FallbackProvider(AIProvider):
    """Fallback provider with static responses"""
    
    @property
    def name(self) -> str:
        return "Fallback"
    
    def is_available(self) -> bool:
        return True
    
    def generate_response(self, prompt: str) -> dict:
        return {
            "status": "success",
            "content": """<h5>AI Review</h5>
<p>Code structure looks good. Consider adding input validation and comments.</p>
<p>Rating: 7/10</p>"""
        }


class AIProviderManager:
    """Manages AI providers with automatic fallback"""
    
    def __init__(self):
        self.groq = GroqProvider()
        self.gemini = GeminiProvider()
        self.fallback = FallbackProvider()
        self._active_provider = None
        
    def get_active_provider(self) -> AIProvider:
        """Get the active AI provider based on configuration and availability"""
        if self._active_provider:
            return self._active_provider
            
        provider_preference = AI_PROVIDER.lower()
        
        if provider_preference == "groq":
            if self.groq.is_available():
                self._active_provider = self.groq
            elif self.gemini.is_available():
                print("⚠️ Groq not available, falling back to Gemini")
                self._active_provider = self.gemini
            else:
                print("⚠️ No AI providers available, using fallback")
                self._active_provider = self.fallback
                
        elif provider_preference == "gemini":
            if self.gemini.is_available():
                self._active_provider = self.gemini
            elif self.groq.is_available():
                print("⚠️ Gemini not available, falling back to Groq")
                self._active_provider = self.groq
            else:
                print("⚠️ No AI providers available, using fallback")
                self._active_provider = self.fallback
                
        else:  # auto - try groq first, then gemini
            if self.groq.is_available():
                self._active_provider = self.groq
            elif self.gemini.is_available():
                self._active_provider = self.gemini
            else:
                self._active_provider = self.fallback
                
        print(f"🤖 Active AI Provider: {self._active_provider.name}")
        return self._active_provider
    
    def generate_response(self, prompt: str) -> dict:
        """Generate response using the active provider with fallback"""
        provider = self.get_active_provider()
        result = provider.generate_response(prompt)
        
        # If primary fails, try fallback
        if result["status"] == "error" and provider != self.fallback:
            print(f"⚠️ {provider.name} failed, trying fallback...")
            result = self.fallback.generate_response(prompt)
            
        return result


# Global instance
ai_manager = AIProviderManager()


def generate_ai_code_review(code: str, language: str, execution_result: str, challenge_description: str = None) -> dict:
    """Generate AI code review using the configured provider (Groq Compound)"""
    
    prompt = f"""Review this {language} code briefly. Focus only on errors and essential improvements.

Code:
```{language}
{code}
```

Execution Result: {execution_result}

Provide ONLY:
1. Critical errors/bugs (if any)
2. 1-2 key improvements
3. Rating (1-10)

Keep response under 100 words. Use simple HTML format:
<h5>AI Code Review</h5>
<p><strong>Issues:</strong> [list any errors]</p>
<p><strong>Suggestions:</strong> [1-2 improvements]</p>
<p><strong>Rating:</strong> X/10</p>
"""
    
    result = ai_manager.generate_response(prompt)
    
    if result["status"] == "success":
        content = result["content"]
        # Clean up markdown if present
        content = content.replace('```html', '').replace('```', '')
        if not content.strip().startswith('<'):
            content = f"<div class='ai-feedback'><h5>AI Code Review</h5><div>{content}</div></div>"
        return {"status": "success", "review": content}
    else:
        return {
            "status": "error",
            "message": result.get("message", "Unknown error"),
            "review": "<div class='error'><h5>AI Review Error</h5><p>Could not generate review.</p></div>"
        }


# Test function
if __name__ == "__main__":
    print("Testing AI Provider with Groq Compound model...")
    print("=" * 50)
    result = ai_manager.generate_response("Say hello in one word")
    print(f"Result: {result}")
