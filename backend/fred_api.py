import requests
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

FRED_API_KEY = os.getenv("FRED_API_KEY", "")

def get_fred_data(series_id="FEDFUNDS"):
    if not FRED_API_KEY:
        print("FRED_API_KEY is not set. Generating mock data.")
        # Mock data for demonstration
        return pd.DataFrame([{"date": f"2023-01-{i:02d}", "value": 4.5 + i*0.01} for i in range(1, 10)])

    url = "https://api.stlouisfed.org/fred/series/observations"
    params = {
        "series_id": series_id,
        "api_key": FRED_API_KEY,
        "file_type": "json",
        "limit": 100,
        "sort_order": "desc"
    }
    
    try:
        r = requests.get(url, params=params)
        r.raise_for_status()
        data = r.json().get("observations", [])
        
        df = pd.DataFrame(data)
        if not df.empty:
            df["value"] = pd.to_numeric(df["value"], errors="coerce")
            return df[["date", "value"]].dropna()
        return df
    except Exception as e:
        print(f"Error fetching FRED data: {e}")
        return pd.DataFrame()
