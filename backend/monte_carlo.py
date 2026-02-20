import numpy as np

def run_monte_carlo(S0, mu, sigma, days=252, sims=1000):
    dt = 1/days
    
    paths = np.zeros((days, sims))
    paths[0] = S0
    
    # Geometric Brownian Motion
    for t in range(1, days):
        Z = np.random.standard_normal(sims)
        paths[t] = paths[t-1] * np.exp((mu - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * Z)
        
    final_prices = paths[-1]
    expected_rate = np.mean(final_prices)
    worst_case = np.percentile(final_prices, 5)
    best_case = np.percentile(final_prices, 95)
    
    return {
        "expected_rate": round(expected_rate, 2),
        "worst_case": round(worst_case, 2),
        "best_case": round(best_case, 2),
        "paths_sample": [paths[:, i].tolist() for i in range(min(10, sims))]
    }
