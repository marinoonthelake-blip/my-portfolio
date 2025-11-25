import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load your key
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

print("🔎 Checking available models for your API Key...")
print("------------------------------------------------")

try:
    for m in genai.list_models():
        # Only show models that can generate text (content)
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ {m.name}")
except Exception as e:
    print(f"❌ Error connecting: {e}")