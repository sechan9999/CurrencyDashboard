import numpy as np
import pandas as pd
from scipy.optimize import minimize

def optimize_portfolio():
    """
    Modern Portfolio Theory Optimizer for maximizing Sharpe Ratio.
    Using mock historical returns for demonstration.
    """
    # Mock return data
    np.random.seed(42)
    assets = ["S&P500", "Gold", "US_Bonds", "BTC"]
    idx = pd.date_range("2023-01-01", periods=252)
    mock_returns = pd.DataFrame(np.random.normal(0.0005, 0.01, (252, 4)), columns=assets, index=idx)
    
    returns = mock_returns.dropna()
    mean_returns = returns.mean() * 252 # annualized
    cov_matrix = returns.cov() * 252

    def portfolio_vol(weights):
        return np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))

    def portfolio_return(weights):
        return np.sum(mean_returns * weights)

    def sharpe(weights):
        # Negative Sharpe ratio for minimization
        return -portfolio_return(weights) / portfolio_vol(weights)

    constraints = ({'type': 'eq', 'fun': lambda x: np.sum(x) - 1})
    bounds = tuple((0,1) for _ in range(len(mean_returns)))
    init_guess = len(mean_returns)*[1/len(mean_returns)]
    
    result = minimize(sharpe, init_guess, bounds=bounds, constraints=constraints)
    optimal_weights = result.x
    
    weights_dict = {assets[i]: round(optimal_weights[i], 4) for i in range(len(assets))}
    return weights_dict
