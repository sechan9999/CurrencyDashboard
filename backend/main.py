# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

from fred_api import get_fred_data
from monte_carlo import run_monte_carlo
from portfolio import optimize_portfolio
from ai_analysis import get_ai_investment_insights

app = FastAPI(title="Currency AI Investment Platform", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AIAnalysisRequest(BaseModel):
    rate: float
    forecast: float
    weights: dict

@app.get("/api/fred")
def fetch_fred(series_id: str):
    """
    Fetch FRED Data: FEDFUNDS, CPIAUCSL, DEXKOUS, etc.
    """
    df = get_fred_data(series_id)
    if df.empty:
        return {"error": "Failed to fetch data"}
    return {"series": series_id, "data": df.to_dict(orient="records")}

@app.get("/api/monte_carlo")
def run_mc(S0: float = 1400.0, mu: float = 0.05, sigma: float = 0.12, days: int = 252, sims: int = 1000):
    """
    Run Monte Carlo Simulation for Exchange Rate or Asset.
    """
    results = run_monte_carlo(S0, mu, sigma, days, sims)
    return results

@app.get("/api/portfolio")
def get_portfolio():
    """
    Portfolio Optimization using Mean-Variance.
    """
    weights = optimize_portfolio()
    return {"optimal_weights": weights}

@app.post("/api/ai_analysis")
def post_ai_analysis(req: AIAnalysisRequest):
    """
    Azure OpenAI AI Investment Analysis.
    """
    insights = get_ai_investment_insights(req.rate, req.forecast, req.weights)
    return {"analysis": insights}
