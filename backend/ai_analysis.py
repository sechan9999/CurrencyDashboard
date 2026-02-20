import os
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()

def get_ai_investment_insights(rate: float, forecast: float, weights: dict):
    # Fallback if unconfigured
    AZURE_OPENAI_KEY = os.getenv("AZURE_OPENAI_KEY", "")
    AZURE_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT", "https://your-endpoint.openai.azure.com/")
    
    if not AZURE_OPENAI_KEY:
        return (
            "Azure OpenAI API key is not configured. "
            f"Based on rules: rate is {rate}%, and expected rate is {forecast}. "
            "Consider allocating based on the optimal weights model."
        )

    try:
        client = AzureOpenAI(
            api_key=AZURE_OPENAI_KEY,
            api_version="2024-02-01",
            azure_endpoint=AZURE_ENDPOINT
        )

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are a senior macro-economic financial analyst. Provide a concise, professional investment recommendation considering rates, currency forecasts, and portfolio allocations."
                },
                {
                    "role": "user",
                    "content": f"""
                    Interest Rate: {rate}%
                    Exchange Rate Forecast: {forecast}
                    Optimal Portfolio Structure: {weights}
                    Provide a short risk analysis and final recommended action in Korean.
                    """
                }
            ],
            temperature=0.7,
            max_tokens=300
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"AI Analysis Failed: {e}"
