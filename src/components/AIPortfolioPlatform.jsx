import { useState, useEffect } from 'react'

export default function AIPortfolioPlatform({ apiKey }) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [aiAnalysis, setAiAnalysis] = useState('')

    const loadPlatformData = async () => {
        setLoading(true)
        try {
            // Attempt to hit local FastAPI
            try {
                const fredRes = await fetch('http://localhost:8000/api/fred?series_id=FEDFUNDS').then(res => res.json())
                const mcRes = await fetch('http://localhost:8000/api/monte_carlo?S0=1380.5&mu=0.03&sigma=0.10').then(res => res.json())
                const portRes = await fetch('http://localhost:8000/api/portfolio').then(res => res.json())

                // Parse
                const rate = fredRes.data?.[0]?.value || 5.5
                const expectedK = mcRes.expected_rate || 1395
                const weights = portRes.optimal_weights || { 'S&P500': 0.45, 'US_Bonds': 0.30, 'Gold': 0.15, 'BTC': 0.10 }

                setData({
                    fred: { rate, cpi: 3.1, dxy: 104.2 }, // partial mock for others
                    ml: { forecastKrw: 1380.5, trend: 'Downward' },
                    monteCarlo: { expected: expectedK, worst: mcRes.worst_case, best: mcRes.best_case },
                    portfolio: weights
                })

                // Connect AI
                const aiRes = await fetch('http://localhost:8000/api/ai_analysis', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rate, forecast: expectedK, weights })
                }).then(res => res.json())

                setAiAnalysis(aiRes.analysis || "분석 결과를 불러왔습니다.")
            } catch (err) {
                console.warn("Backend not available, using simulated data.", err)
                // Fallback to simulated data for frontend demo
                await new Promise(r => setTimeout(r, 1000))

                const simulatedData = {
                    fred: { rate: 5.5, cpi: 3.1, dxy: 104.2 },
                    ml: { forecastKrw: 1380.5, trend: 'Downward' },
                    monteCarlo: { expected: 1395, worst: 1250, best: 1510 },
                    portfolio: { 'S&P500': 0.45, 'US_Bonds': 0.30, 'Gold': 0.15, 'BTC': 0.10 }
                }
                setData(simulatedData)
                setAiAnalysis("현재 금리(5.5%)와 인플레이션 지수(3.1%)를 고려할 때, 미달러화의 강세 압력이 둔화되고 있습니다. \n\n머신러닝 예측 모델은 원달러 환율의 완만한 하락(1380원대)을 예상합니다. 몬테카를로 시뮬레이션 결과 하방 마진율 대비 상승 마진율이 제한적입니다.\n\n[추천 포트폴리오]\n- S&P 500 (45%): 금리 인하 기대감으로 주식 비중 유지\n- 미국채 (30%): 매크로 헤지 및 안정적 이자 수익\n- 금 (15%): 인플레이션 방어 및 안전 자산\n- 대안 자산 (10%): 알파 수익 확보를 위한 소규모 위성 투자\n\n[결론] 미국 자산 중심의 안정적 분산투자 전략이 현 거시경제 국면에 가장 적합합니다.")
            }

        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    AI Macro-Economic Investment Platform
                </h2>
                <button
                    onClick={loadPlatformData}
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg text-white font-semibold transition-all shadow-lg disabled:opacity-50"
                >
                    {loading ? 'Analyzing...' : 'Run Full AI Analysis'}
                </button>
            </div>

            {!data && !loading && (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-800/50 rounded-2xl border border-slate-700/50 min-h-[400px]">
                    <div className="text-6xl mb-4">🤖</div>
                    <div className="text-xl text-slate-300 font-medium">Ready to analyze macro economy...</div>
                    <p className="text-slate-500 mt-2 max-w-md text-center">FRED APIs, ML Models, and Monte Carlo engines are on standby to generate optimal portfolios and AI insights.</p>
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-800/50 rounded-2xl border border-blue-500/30 min-h-[400px] animate-pulse">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <div className="text-xl text-blue-400 font-medium">Running Macro Analysis Pipeline...</div>
                    <div className="flex gap-2 text-sm text-slate-400 mt-4">
                        <span className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-ping"></span> FRED Data</span>
                        <span className="flex items-center"><span className="w-2 h-2 bg-amber-400 rounded-full mr-1 animate-ping" style={{ animationDelay: '0.2s' }}></span> ML Inference</span>
                        <span className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-1 animate-ping" style={{ animationDelay: '0.4s' }}></span> MPT Optimization</span>
                    </div>
                </div>
            )}

            {data && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* FRED API */}
                    <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
                        <h3 className="text-sm text-slate-400 font-semibold uppercase mb-3 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                            FRED API Data
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-300">Interest Rate</span>
                                <span className="text-white font-mono">{data.fred.rate}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-300">CPI</span>
                                <span className="text-white font-mono">{data.fred.cpi}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-300">DXY (Dollar Idx)</span>
                                <span className="text-white font-mono">{data.fred.dxy}</span>
                            </div>
                        </div>
                    </div>

                    {/* ML Model */}
                    <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 backdrop-blur-sm hover:border-green-500/50 transition-colors">
                        <h3 className="text-sm text-slate-400 font-semibold uppercase mb-3 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                            XGBoost / LSTM
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-300">Target</span>
                                <span className="text-slate-400 text-sm">USD/KRW</span>
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <span className="text-slate-300">Forecast</span>
                                <span className="text-2xl text-green-400 font-mono font-bold">₩{data.ml.forecastKrw}</span>
                            </div>
                            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-green-400 h-full w-2/3"></div>
                            </div>
                        </div>
                    </div>

                    {/* Monte Carlo */}
                    <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
                        <h3 className="text-sm text-slate-400 font-semibold uppercase mb-3 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-purple-400 mr-2"></span>
                            Risk Simulation
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Best Case (95%)</span>
                                <span className="text-red-400 font-mono">₩{data.monteCarlo.best}</span>
                            </div>
                            <div className="flex justify-between font-bold border-y border-slate-700 py-1 my-1">
                                <span className="text-white">Expected</span>
                                <span className="text-blue-400 font-mono">₩{data.monteCarlo.expected}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Worst Case (5%)</span>
                                <span className="text-green-400 font-mono">₩{data.monteCarlo.worst}</span>
                            </div>
                        </div>
                    </div>

                    {/* Portfolio */}
                    <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 backdrop-blur-sm hover:border-amber-500/50 transition-colors">
                        <h3 className="text-sm text-slate-400 font-semibold uppercase mb-3 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
                            MPT Optimizer
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(data.portfolio).map(([asset, weight]) => (
                                <div key={asset} className="bg-slate-900 rounded p-2 text-center">
                                    <div className="text-xs text-slate-400">{asset}</div>
                                    <div className="text-sm text-white font-bold">{weight * 100}%</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* OpenAI AI Analysis */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-2">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-indigo-500/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <span className="bg-indigo-500 text-white rounded p-1 mr-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </span>
                                Azure OpenAI Investment Analyst
                            </h3>
                            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap relative z-10 font-medium">
                                {aiAnalysis}
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}
