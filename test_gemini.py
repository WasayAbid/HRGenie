import utils.config
import google.generativeai as genai

try:
    model = genai.GenerativeModel("gemini-1.5-flash")

    response = model.generate_content(
        "Say hello in one sentence."
    )

    print("\nGemini Response:\n")
    print(response.text)

except Exception as e:
    print(f"Error: {e}")