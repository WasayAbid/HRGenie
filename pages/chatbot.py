import streamlit as st
import chromadb
import os
import speech_recognition as sr
import pyttsx3

from dotenv import load_dotenv
from google import genai

# =========================
# CONFIG
# =========================

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    st.error("❌ GEMINI_API_KEY missing")
    st.stop()

client = genai.Client(api_key=API_KEY)

# =========================
# PAGE HEADER
# =========================

st.title("🤖 HRGenie AI Assistant")

col1, col2 = st.columns([1, 3])

with col1:
    try:
        st.image("assets/hr.png", width=180)
    except:
        st.warning("Avatar image missing")

with col2:
    st.markdown("""
### 👋 Hello!

I am **HRGenie**.

Your AI-powered HR Assistant.

I can help with:

✅ Leave Policies

✅ Promotions

✅ Work From Home

✅ Recruitment

✅ HR Documentation

🎤 Voice + Text Supported
""")

st.divider()

# =========================
# CHROMA DB
# =========================

db = chromadb.PersistentClient(path="chroma_db")

collection = db.get_or_create_collection(
    "policies"
)

# =========================
# CHAT HISTORY
# =========================

if "messages" not in st.session_state:
    st.session_state.messages = []

# =========================
# SPEECH ENGINE
# =========================

engine = pyttsx3.init()

def speak(text):
    try:
        engine.say(text)
        engine.runAndWait()
    except:
        pass

# =========================
# VOICE INPUT
# =========================

def listen():

    recognizer = sr.Recognizer()

    with sr.Microphone() as source:

        st.info("🎤 Listening...")

        audio = recognizer.listen(source)

    try:
        return recognizer.recognize_google(audio)

    except:
        return None

# =========================
# EMBEDDING
# =========================

def embed(text):

    try:

        result = client.models.embed_content(
            model="gemini-embedding-001",
            contents=[text]
        )

        return result.embeddings[0].values

    except Exception as e:

        st.error(
            f"Embedding error:\n{e}"
        )

        return None

# =========================
# RAG ANSWER
# =========================

def get_answer(query):

    query_embedding = embed(query)

    if query_embedding is None:
        return "⚠️ Embedding failed."

    try:

        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=3
        )

    except Exception as e:

        return f"⚠️ ChromaDB error:\n{e}"

    docs = results.get("documents", [[]])[0]

    if not docs:
        return "No policy found."

    context = "\n".join(docs)

    prompt = f"""
You are HRGenie AI Assistant.

Answer ONLY using the context below.

Context:
{context}

Question:
{query}

Provide a clear HR answer.
"""

    try:

        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:

        return (
            "⚠️ Gemini API failed.\n\n"
            f"{str(e)}"
        )

# =========================
# SHOW CHAT HISTORY
# =========================

for msg in st.session_state.messages:

    with st.chat_message(msg["role"]):

        st.write(msg["content"])

# =========================
# VOICE BUTTON
# =========================

col1, col2 = st.columns([1,4])

with col1:

    voice_clicked = st.button("🎙 Speak")

with col2:

    query = st.chat_input(
        "Ask HRGenie..."
    )

# =========================
# VOICE FLOW
# =========================

if voice_clicked:

    voice_text = listen()

    if voice_text:

        query = voice_text

        st.success(
            f"You said: {voice_text}"
        )

# =========================
# MAIN CHAT FLOW
# =========================

if query:

    st.session_state.messages.append({
        "role":"user",
        "content":query
    })

    with st.chat_message("user"):

        st.write(query)

    with st.chat_message("assistant"):

        placeholder = st.empty()

        placeholder.markdown(
            "🤖 *Thinking...*"
        )

        answer = get_answer(query)

        placeholder.markdown(answer)

    st.session_state.messages.append({
        "role":"assistant",
        "content":answer
    })

    # Voice output
    speak(answer)