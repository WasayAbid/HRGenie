# HRGenie — AI HR Insight Engine

An AI-powered HR platform built with FastAPI, Streamlit, and Next.js. Predicts employee attrition, screens candidates, generates job descriptions and offer letters, and answers HR policy questions via an AI chatbot.

---

## Features

- **Attrition Prediction** — ML model (IBM dataset) scores every employee's risk of leaving
- **AI Chatbot** — RAG-powered assistant answers HR policy questions with streaming responses
- **JD Generator** — Generates professional job descriptions via Gemini AI
- **Offer Letter Generator** — Creates personalised offer letters instantly
- **CIO Reporting** — Executive-grade recruitment intelligence reports
- **Recruitment Pipeline** — Resume parsing and match scoring

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, Tailwind CSS, Framer Motion |
| Backend API | FastAPI, Uvicorn |
| AI | Google Gemini 2.5 Flash Lite |
| ML Model | scikit-learn (attrition prediction) |
| Vector DB | ChromaDB (RAG) |
| Legacy UI | Streamlit |

---

## Prerequisites

- Python 3.11+
- Node.js 18+
- A Gemini API key — get one free at [aistudio.google.com](https://aistudio.google.com)

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/WasayAbid/HRGenie.git
cd HRGenie
```

### 2. Add your Gemini API key

Create a `.env` file in the project root:

```
GEMINI_API_KEY=your_key_here
```

### 3. Set up Python environment

```bash
python -m venv venv

# Windows
venv\Scripts\pip install -r requirements.txt

# Mac/Linux
venv/bin/pip install -r requirements.txt
```

### 4. Set up the Next.js frontend

```bash
cd hrgenie-next
npm install
cd ..
```

---

## Running the App

### Option A — One click (Windows)

Double-click `start.bat` in the project root. It opens all three services automatically.

### Option B — Manual

Open three terminals and run each:

**Terminal 1 — Python API (port 8000)**
```bash
# Windows
venv\Scripts\uvicorn api_server:app --host 0.0.0.0 --port 8000 --reload

# Mac/Linux
venv/bin/uvicorn api_server:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 — Next.js Frontend (port 3000)**
```bash
cd hrgenie-next
npm run dev
```

**Terminal 3 — Streamlit (port 8501, optional)**
```bash
# Windows
venv\Scripts\streamlit run app.py

# Mac/Linux
venv/bin/streamlit run app.py
```

---

## URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Streamlit | http://localhost:8501 |

---

## Project Structure

```
HRGenie/
├── api_server.py          # FastAPI backend
├── app.py                 # Streamlit entry point
├── requirements.txt       # Python dependencies
├── start.bat              # Windows one-click launcher
├── .env                   # API keys (not committed)
├── data/                  # IBM HR dataset
├── ml/                    # Trained attrition model
├── pages/                 # Streamlit pages
├── utils/                 # Shared Python utilities
│   ├── gemini_client.py
│   ├── db.py
│   └── pdf_generator.py
└── hrgenie-next/          # Next.js frontend
    ├── app/               # Pages (App Router)
    ├── components/        # Shared UI components
    └── lib/api.ts         # API client
```
