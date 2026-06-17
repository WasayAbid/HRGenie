import os
import glob
import chromadb
from dotenv import load_dotenv
from google import genai

# -------------------------
# Load API KEY
# -------------------------
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found")

client = genai.Client(api_key=API_KEY)

# -------------------------
# Chroma DB
# -------------------------
db = chromadb.PersistentClient(path="chroma_db")
collection = db.get_or_create_collection("hr_policies")

print("\n🔄 Starting indexing process...")

# -------------------------
# Embedding function
# -------------------------
def get_embedding(text):
    try:
        result = client.models.embed_content(
            model="gemini-embedding-001",
            contents=[text]
        )
        return result.embeddings[0].values

    except Exception as e:
        print(f"❌ Embedding failed for text: {text[:30]}...")
        print("Error:", e)
        return None


# -------------------------
# Load files
# -------------------------
files = glob.glob("policies/*.txt")

print("Files Found:", files)

count = 0

# -------------------------
# Indexing
# -------------------------
for file in files:

    with open(file, "r", encoding="utf-8") as f:
        text = f.read()

    chunks = text.split("\n")

    for i, chunk in enumerate(chunks):

        chunk = chunk.strip()

        if not chunk:
            continue

        embedding = get_embedding(chunk)

        if embedding is None:
            continue

        doc_id = f"{os.path.basename(file)}_{i}"

        try:
            collection.add(
                documents=[chunk],
                embeddings=[embedding],
                ids=[doc_id],
                metadatas=[{"source": file}]
            )

            count += 1

        except Exception as e:
            print("⚠️ Skipped duplicate/error:", doc_id)

print("\n========================")
print(f"✅ INDEXING COMPLETE: {count} chunks stored")
print("========================")