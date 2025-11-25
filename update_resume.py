import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# CONFIG
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
MODEL_NAME = "gemini-2.0-flash" 

def load_file(filepath):
    with open(filepath, "r") as f:
        return f.read()

def save_json(filepath, data):
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)

def run_architect(answers):
    print("\n✨ Architect is polishing your experience...")
    system_prompt = load_file("gems/resume_architect.txt")
    
    prompt = f"""
    RAW USER INPUT:
    - Role/Project: {answers['role']}
    - Challenge: {answers['challenge']}
    - Solution/Tech: {answers['solution']}
    - Impact/Metrics: {answers['impact']}
    
    TASK: Format this into a pristine JSON resume entry.
    """
    
    model = genai.GenerativeModel(model_name=MODEL_NAME, system_instruction=system_prompt)
    response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
    return json.loads(response.text)

# --- THE INTERVIEW LOOP ---
if __name__ == "__main__":
    print("🎤 --- RESUME INTERVIEW MODE ---")
    print("I will ask you 4 questions to capture your new work.\n")
    
    # 1. Collect Data
    role = input("1. What was the Role or Project Name? (e.g. 'Lead AI Engineer'): ")
    challenge = input("2. What was the core problem/challenge? ")
    solution = input("3. What tech/solution did you build? (e.g. 'Used Vertex AI'): ")
    impact = input("4. What was the result? (Metrics, Savings, Speed): ")
    
    answers = {
        "role": role,
        "challenge": challenge,
        "solution": solution,
        "impact": impact
    }
    
    # 2. Refine Data with AI
    new_entry_wrapper = run_architect(answers)
    new_data = new_entry_wrapper["new_entry"]
    
    print("\n--- 💎 REFINED ENTRY ---")
    print(json.dumps(new_data, indent=2))
    
    confirm = input("\nDoes this look good? (y/n): ")
    
    if confirm.lower() == 'y':
        # 3. Update the Master Resume
        try:
            with open("data/master_resume.json", "r") as f:
                master_resume = json.load(f)
            
            # Add to experience_highlights
            master_resume["experience_highlights"].insert(0, new_data)
            
            # Save back
            save_json("data/master_resume.json", master_resume)
            print("✅ Master Resume updated successfully!")
        except Exception as e:
            print(f"❌ Error updating file: {e}")
    else:
        print("❌ Update cancelled.")