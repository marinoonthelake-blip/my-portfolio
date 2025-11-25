import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# 1. CONFIGURATION
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

MODEL_NAME = "gemini-2.0-flash" 

def load_file(filepath):
    try:
        with open(filepath, "r") as f:
            return f.read()
    except FileNotFoundError:
        return ""

def save_file(filepath, content):
    with open(filepath, "w") as f:
        f.write(content)

# --- AGENT 1: THE PROFILER ---
def run_profiler(headline):
    print(f"\n1️⃣  Profiler scanning: '{headline}'...")
    system_prompt = load_file("gems/executive_profiler.txt")
    model = genai.GenerativeModel(model_name=MODEL_NAME, system_instruction=system_prompt)
    response = model.generate_content(
        f"Analyze this news: {headline}",
        generation_config={"response_mime_type": "application/json"}
    )
    return json.loads(response.text)

# --- AGENT 2: THE BRAIN ---
def run_brain(profiler_data):
    print(f"2️⃣  Brain strategizing...")
    system_prompt = load_file("gems/brain_prime.txt")
    resume_data = load_file("data/master_resume.json")
    
    prompt = f"""
    MARKET INTEL: {json.dumps(profiler_data)}
    MY RESUME: {resume_data}
    TASK: Determine if we should pivot the brand.
    """
    model = genai.GenerativeModel(model_name=MODEL_NAME, system_instruction=system_prompt)
    response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
    return json.loads(response.text)

# --- AGENT 3: THE CONSTRUCTOR ---
def run_constructor(brain_data):
    print(f"3️⃣  Constructor building...")
    system_prompt = load_file("gems/constructor.txt")
    
    prompt = f"""
    STRATEGIC MANDATE: {json.dumps(brain_data)}
    TASK: Generate the JSON content for the website frontend.
    """
    model = genai.GenerativeModel(model_name=MODEL_NAME, system_instruction=system_prompt)
    response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
    return json.loads(response.text)

# --- MAIN WORKFLOW ---
if __name__ == "__main__":
    # The Trigger
    news_headline = "New regulations require tech companies to map all data lineage by 2026."
    
    # Step 1
    profiler_output = run_profiler(news_headline)
    
    # Step 2
    brain_output = run_brain(profiler_output)
    
    if brain_output.get("decision") == "APPROVE":
        # Step 3 (Run the Constructor)
        site_content = run_constructor(brain_output)
        
        # SAVE THE RESULT
        output_path = "data/generated_site_content.json"
        save_file(output_path, json.dumps(site_content, indent=2))
        
        print(f"\n✅ SYSTEM SUCCESS. Content generated at: {output_path}")
        print(json.dumps(site_content, indent=2))
    else:
        print("\n⛔ Brain rejected the topic. No site update needed.")