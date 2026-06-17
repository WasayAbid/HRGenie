from utils.db import init_db, get_connection
import streamlit as st
import pdfplumber
import docx2txt
import json

init_db()

st.title("📄 AI Recruitment Agent")

st.write("Upload a candidate resume (PDF or DOCX)")

uploaded_file = st.file_uploader("Upload Resume", type=["pdf", "docx"])


# -------------------------
# Resume Extraction
# -------------------------
def extract_text(file):
    text = ""

    if file.name.endswith(".pdf"):
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""

    elif file.name.endswith(".docx"):
        text = docx2txt.process(file)

    return text


# -------------------------
# Mock AI Parser
# -------------------------
def mock_ai_parse(text):
    return {
        "name": "Demo Candidate",
        "email": "demo@email.com",
        "skills": ["Python", "AI", "ML"],
        "experience_years": 2,
        "education": "BS Computer Science"
    }


# -------------------------
# Scoring Function
# -------------------------
def calculate_match(resume_data, jd_text):
    score = 0
    reasoning = []

    jd_text = jd_text.lower()

    for skill in resume_data["skills"]:
        if skill.lower() in jd_text:
            score += 25
            reasoning.append(f"Skill match: {skill}")

    if resume_data["experience_years"] >= 2:
        score += 25
        reasoning.append("Good experience level")

    if "computer" in resume_data["education"].lower():
        score += 20
        reasoning.append("Relevant education")

    score = min(score, 100)

    return score, reasoning


# -------------------------
# Save to DB
# -------------------------
def save_candidate(data, score, reasoning, jd_text):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO candidates (
            name, email, skills, experience_years,
            education, raw_text, jd_title,
            match_score, match_reasoning
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["name"],
        data["email"],
        ",".join(data["skills"]),
        data["experience_years"],
        data["education"],
        str(data),
        jd_text[:50],
        score,
        str(reasoning)
    ))

    conn.commit()
    conn.close()


# -------------------------
# MAIN UI FLOW
# -------------------------
if uploaded_file is not None:

    st.success("File uploaded successfully!")

    resume_text = extract_text(uploaded_file)

    st.subheader("📌 Extracted Resume Text")
    st.write(resume_text)

    st.subheader("🧠 AI Structured Output (Mock Mode)")

    structured_data = mock_ai_parse(resume_text)

    st.json(structured_data)

    st.subheader("💼 Job Description")

    jd_text = st.text_area("Paste Job Description here")

    if jd_text:

        score, reasoning = calculate_match(structured_data, jd_text)

        save_candidate(structured_data, score, reasoning, jd_text)

        st.subheader("📊 Match Score")
        st.metric("Candidate Fit Score", f"{score}/100")

        st.subheader("🧠 Reasoning")
        for r in reasoning:
            st.write("✔", r)


# -------------------------
# Ranking Table (Always Visible)
# -------------------------
st.subheader("📊 Candidate Rankings")

conn = get_connection()
cursor = conn.cursor()

cursor.execute("""
    SELECT name, email, skills, experience_years, match_score
    FROM candidates
    ORDER BY match_score DESC
""")

rows = cursor.fetchall()

if rows:
    for r in rows:
        st.write(r)
else:
    st.info("No candidates yet")