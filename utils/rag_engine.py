import chromadb
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=API_KEY)

# -------------------------
# DB
# -------------------------
db = chromadb.PersistentClient(path="chroma_db")
collection = db.get_or_create_collection("hr_policies")

# -------------------------
# EMBEDDING
# -------------------------
def embed(text):
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=[text]
    )
    return result.embeddings[0].values

# -------------------------
# QUERY FUNCTION
# -------------------------
def retrieve_answer(query):

    query_embedding = embed(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=3
    )

    context = "\n".join(results["documents"][0])

    prompt = f"""
You are HRGenie AI Assistant.

Context:
{context}

Question:
{query}

Answer clearly and briefly.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )

    return response.text