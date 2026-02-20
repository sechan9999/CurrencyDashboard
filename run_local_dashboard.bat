@echo off
echo Starting CurrencyDashboard Local Environment...

echo [1/2] Starting FastAPI Backend on port 8000...
start cmd /k ".\venv\Scripts\activate && cd backend && uvicorn main:app --reload --port 8000"

echo [2/2] Starting React Vite Frontend...
start cmd /k "npm run dev"

echo Done! The frontend will be available at http://localhost:5173
echo The backend API will be available at http://localhost:8000
