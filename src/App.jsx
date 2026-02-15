import { useState } from 'react'
import UltimateEconomySim from './components/UltimateEconomySim'
import AnchorCurrencyDashboard from './components/AnchorCurrencyDashboard'

function App() {
    const [view, setView] = useState('dashboard')

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Top Navigation */}
            <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <span className="text-amber-400 font-bold text-lg">💰 CurrencyDashboard</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setView('dashboard')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                view === 'dashboard'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                        >
                            기축통화 대시보드
                        </button>
                        <button
                            onClick={() => setView('simulator')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                view === 'simulator'
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                        >
                            자산 시뮬레이터
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content */}
            {view === 'dashboard' ? (
                <AnchorCurrencyDashboard />
            ) : (
                <div className="max-w-4xl mx-auto p-4">
                    <UltimateEconomySim />
                </div>
            )}
        </div>
    )
}

export default App
