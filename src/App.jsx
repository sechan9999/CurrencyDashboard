import { useState } from 'react'
import UltimateEconomySim from './components/UltimateEconomySim'
import AnchorCurrencyDashboard from './components/AnchorCurrencyDashboard'
import SystemMonitor from './components/SystemMonitor'
import AIPortfolioPlatform from './components/AIPortfolioPlatform'
import { testApiKey } from './lib/openai'

function App() {
    const [view, setView] = useState('dashboard')
    const [apiKey, setApiKey] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [modalKey, setModalKey] = useState('')
    const [modalStatus, setModalStatus] = useState('')
    const [testing, setTesting] = useState(false)

    const handleSaveKey = async () => {
        const key = modalKey.trim()
        if (!key) {
            setApiKey('')
            setShowModal(false)
            return
        }
        setTesting(true)
        setModalStatus('연결 테스트 중...')
        try {
            await testApiKey(key)
            setApiKey(key)
            setModalStatus('✅ 연결 성공')
            setTimeout(() => setShowModal(false), 600)
        } catch (e) {
            setModalStatus(`❌ ${e.message}`)
        } finally {
            setTesting(false)
        }
    }

    const tabs = [
        { id: 'dashboard', label: '기축통화 대시보드', color: 'amber' },
        { id: 'simulator', label: '자산 시뮬레이터', color: 'blue' },
        { id: 'monitor', label: '시스템 모니터링', color: 'green' },
        { id: 'aiplatform', label: 'AI 투자 플랫폼', color: 'purple' },
    ]

    const getTabClasses = (tab) => {
        const active = view === tab.id
        const colorMap = {
            amber: active ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : '',
            blue: active ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : '',
            green: active ? 'bg-green-500/20 text-green-400 border border-green-500/50' : '',
            purple: active ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : '',
        }
        return active
            ? `px-4 py-2 rounded-lg text-sm font-medium transition-all ${colorMap[tab.color]}`
            : 'px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-400 hover:text-slate-200 hover:bg-slate-800'
    }

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <span className="text-amber-400 font-bold text-lg">💰 CurrencyDashboard</span>
                    <div className="flex items-center gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setView(tab.id)}
                                className={getTabClasses(tab)}
                            >
                                {tab.label}
                            </button>
                        ))}

                        {/* OpenAI Settings */}
                        <button
                            onClick={() => { setModalKey(apiKey); setModalStatus(''); setShowModal(true) }}
                            className="ml-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            OpenAI
                            <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]' : 'bg-slate-600'}`} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content */}
            {view === 'dashboard' && <AnchorCurrencyDashboard />}
            {view === 'simulator' && (
                <div className="max-w-4xl mx-auto p-4">
                    <UltimateEconomySim apiKey={apiKey} />
                </div>
            )}
            {view === 'monitor' && <SystemMonitor apiKey={apiKey} />}
            {view === 'aiplatform' && (
                <div className="max-w-6xl mx-auto">
                    <AIPortfolioPlatform apiKey={apiKey} />
                </div>
            )}

            {/* API Key Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200]"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
                >
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-bold text-white mb-4">OpenAI API 설정</h3>
                        <input
                            type="password"
                            value={modalKey}
                            onChange={(e) => setModalKey(e.target.value)}
                            placeholder="sk-..."
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            API 키는 브라우저 메모리에만 저장됩니다. 새로고침 시 초기화됩니다.
                        </p>
                        {modalStatus && (
                            <p className="text-sm mt-2">{modalStatus}</p>
                        )}
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2.5 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSaveKey}
                                disabled={testing}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 transition-all font-medium"
                            >
                                {testing ? '테스트 중...' : '저장 & 테스트'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default App
