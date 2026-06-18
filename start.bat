@echo off
echo Starting HRGenie...

:: 1. Python API (FastAPI on port 8000)
start "HRGenie API" cmd /k "cd /d %~dp0 && venv\Scripts\uvicorn.exe api_server:app --host 0.0.0.0 --port 8000 --reload"

:: 2. Streamlit app (port 8501)
start "HRGenie Streamlit" cmd /k "cd /d %~dp0 && venv\Scripts\streamlit.exe run app.py"

:: 3. Next.js frontend (port 3000)
start "HRGenie Frontend" cmd /k "cd /d %~dp0\hrgenie-next && npm run dev"

echo.
echo All services starting:
echo   Streamlit  -^>  http://localhost:8501
echo   API        -^>  http://localhost:8000
echo   Frontend   -^>  http://localhost:3000
echo.
pause
