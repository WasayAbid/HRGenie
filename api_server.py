from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import pandas as pd
import joblib
import chromadb
import numpy as np
import os

from utils.gemini_client import generate_text
from utils.db import get_connection

app = FastAPI(title="AI HR Insight Engine API")

# =========================================
# CORS (React FRONTEND READY)
# =========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================
# LOAD ML MODEL (ATTRITION)
# =========================================

MODEL_PATH = "ml/attrition_model.joblib"
FEATURE_PATH = "ml/feature_columns.json"

model = joblib.load(MODEL_PATH)

import json
with open(FEATURE_PATH, "r") as f:
    feature_columns = json.load(f)

# =========================================
# CHROMA DB (RAG)
# =========================================

db = chromadb.PersistentClient(path="chroma_db")
collection = db.get_or_create_collection("policies")

# =========================================
# ROOT
# =========================================

@app.get("/")
def home():
    return {"status": "HR Insight Engine API Running 🚀"}

# =========================================
# 1. JD GENERATOR API
# =========================================

@app.post("/jd/generate")
def generate_jd(data: dict):

    prompt = f"""
You are an HR expert.

Create Job Description:

Role: {data.get('role')}
Department: {data.get('department')}
Experience: {data.get('experience')}
Skills: {data.get('skills')}

Return structured JD.
"""

    result = generate_text(prompt)

    return {"jd": result}

# =========================================
# 2. OFFER LETTER API
# =========================================

@app.post("/offer/generate")
def generate_offer(data: dict):

    prompt = f"""
Create Offer Letter:

Name: {data.get('name')}
Position: {data.get('position')}
Department: {data.get('department')}
Salary: {data.get('salary')}
Date: {data.get('date')}
"""

    result = generate_text(prompt)

    return {"offer_letter": result}

# =========================================
# 3. CHATBOT (RAG)
# =========================================

@app.post("/chat/ask")
def chat(data: dict):

    query = data.get("query")

    results = collection.query(
        query_texts=[query],
        n_results=3
    )

    context = "\n".join(results["documents"][0])

    prompt = f"""
Answer using HR policy context:

{context}

Question: {query}
"""

    answer = generate_text(prompt)

    return {
        "answer": answer,
        "sources": results["metadatas"]
    }

# =========================================
# 3b. CHATBOT STREAMING
# =========================================

@app.post("/chat/stream")
def chat_stream(data: dict):
    from utils.gemini_client import client

    query = data.get("query", "")

    # Only do RAG if policies are indexed — avoids embedding model download delay
    context = ""
    if collection.count() > 0:
        try:
            results = collection.query(query_texts=[query], n_results=3)
            context = "\n".join(results["documents"][0])
        except Exception:
            pass

    if context:
        prompt = f"""You are HRGenie, an AI HR Assistant.
Answer clearly using the HR policy context below.
Format using markdown: **bold**, bullet points, headers where appropriate.

Context:
{context}

Question: {query}
"""
    else:
        prompt = f"""You are HRGenie, an AI HR Assistant.
Answer the HR question clearly and professionally.
Format using markdown: **bold**, bullet points, headers where appropriate.

Question: {query}
"""

    def generate():
        for chunk in client.models.generate_content_stream(
            model="gemini-2.5-flash-lite",
            contents=prompt
        ):
            if chunk.text:
                yield chunk.text

    return StreamingResponse(generate(), media_type="text/plain", headers={"X-Accel-Buffering": "no"})

# =========================================
# 4. CIO REPORTING ENGINE
# =========================================

@app.get("/cio/report")
def cio_report():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT COUNT(*), AVG(match_score)
        FROM candidates
    """)

    total, avg_score = cursor.fetchone()
    conn.close()

    prompt = f"""
You are CIO of HR.

Data:
Total Candidates: {total}
Average Match Score: {avg_score}

Generate:
- Executive Summary
- Hiring Insights
- Risks
- Recommendations
"""

    report = generate_text(prompt)

    return {
        "report": report,
        "total_candidates": total,
        "avg_score": avg_score
    }

# =========================================
# 5. ATTRITION PREDICTION API
# =========================================

@app.get("/attrition/predict")
def attrition_predict():

    df = pd.read_csv("data/IBM_EmployeeAttrition_dataset.csv")

    employee_ids = df["EmployeeNumber"].copy()

    df = df.drop(
        columns=[
            "EmployeeCount",
            "Over18",
            "StandardHours",
            "EmployeeNumber"
        ]
    )

    df["Attrition"] = df["Attrition"].map({"No": 0, "Yes": 1})
    df = df.drop("Attrition", axis=1)

    df_encoded = pd.get_dummies(df)
    df_encoded = df_encoded.reindex(columns=feature_columns, fill_value=0)

    risk = model.predict_proba(df_encoded)[:, 1]

    result = []

    for i in range(len(risk)):
        result.append({
            "employee_id": int(employee_ids.iloc[i]),
            "risk": float(round(risk[i] * 100, 2))
        })

    return {"results": result}

# =========================================
# 6. RECRUITMENT DATA API
# =========================================

@app.get("/candidates")
def get_candidates():

    conn = get_connection()
    df = pd.read_sql("SELECT * FROM candidates", conn)
    conn.close()

    return df.to_dict(orient="records")