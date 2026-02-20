import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split

def train_exchange_rate_model(df):
    """
    Train XGBoost model for USD/KRW prediction based on micro-economic indicators.
    """
    if "usdkrw" not in df.columns:
        return "Target variable usdkrw not found."

    features = [col for col in ["interest_diff", "inflation_diff", "bond_yield", "vix"] if col in df.columns]
    
    X = df[features]
    y = df["usdkrw"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = xgb.XGBRegressor(objective='reg:squarederror')
    model.fit(X_train, y_train)
    
    # Predicting on test data for evaluation
    predictions = model.predict(X_test)
    
    return {
        "model": model,
        "features": features,
        "test_score": model.score(X_test, y_test)
    }

def predict_exchange_rate(model, features_input):
    """
    Predict next step exchange rate given feature values.
    """
    input_df = pd.DataFrame([features_input])
    prediction = model.predict(input_df)
    return float(prediction[0])
