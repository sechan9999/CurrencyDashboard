import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Database, Wifi, WifiOff, RefreshCw, Trash2 } from 'lucide-react';
import { getStats, clearCache } from '../lib/openai';

const APP_VERSION = '2.0.0';
const PAGE_LOAD_TIME = Date.now();

function formatUptime(ms) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
}

const StatusBadge = ({ status }) => {
    const colors = {
        healthy: 'bg-green-500/20 text-green-400 border-green-500/30',
        degraded: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        disconnected: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[status] || colors.disconnected}`}>
            {status === 'healthy' ? '정상' : status === 'degraded' ? '주의' : '미연결'}
        </span>
    );
};

const MetricCard = ({ label, value, sub, icon: Icon, color = 'text-blue-400' }) => (
    <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
        <div className="flex items-center gap-2 mb-3">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-slate-400 text-sm">{label}</span>
        </div>
        <div className="text-2xl font-bold text-white">{value}</div>
        {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
);

const SystemMonitor = ({ apiKey }) => {
    const [stats, setStats] = useState(getStats());
    const [uptime, setUptime] = useState('0h 0m 0s');

    useEffect(() => {
        const interval = setInterval(() => {
            setUptime(formatUptime(Date.now() - PAGE_LOAD_TIME));
            setStats(getStats());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const openaiStatus = apiKey ? (stats.failCount > stats.successCount ? 'degraded' : 'healthy') : 'disconnected';
    const errorRate = stats.totalCalls > 0 ? ((stats.failCount / stats.totalCalls) * 100).toFixed(1) : '0.0';

    const handleClearCache = () => {
        clearCache();
        setStats(getStats());
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Activity className="w-7 h-7 text-green-400" />
                        시스템 모니터링
                    </h2>
                    <p className="text-slate-400 mt-1">클라이언트 사이드 앱 상태 및 API 사용 현황</p>
                </div>
                <button
                    onClick={() => setStats(getStats())}
                    className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
                >
                    <RefreshCw className="w-4 h-4" />
                    새로고침
                </button>
            </div>

            {/* App Status */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-400" />
                    앱 상태
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">버전</div>
                        <div className="text-white font-semibold mt-1">v{APP_VERSION}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">가동 시간</div>
                        <div className="text-white font-semibold mt-1">{uptime}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">환경</div>
                        <div className="text-white font-semibold mt-1">GitHub Pages</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">런타임</div>
                        <div className="text-white font-semibold mt-1">Client-Side React</div>
                    </div>
                </div>
            </div>

            {/* OpenAI Connection */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        {apiKey ? <Wifi className="w-5 h-5 text-green-400" /> : <WifiOff className="w-5 h-5 text-slate-500" />}
                        OpenAI 연결 상태
                    </h3>
                    <StatusBadge status={openaiStatus} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">API 키</div>
                        <div className="text-white font-semibold mt-1">
                            {apiKey ? `sk-...${apiKey.slice(-4)}` : '미설정'}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">모델</div>
                        <div className="text-white font-semibold mt-1">gpt-4o-mini</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">마지막 호출</div>
                        <div className="text-white font-semibold mt-1">
                            {stats.lastCallTime ? new Date(stats.lastCallTime).toLocaleTimeString('ko-KR') : '없음'}
                        </div>
                    </div>
                </div>
            </div>

            {/* API Usage Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    label="총 API 호출"
                    value={stats.totalCalls}
                    sub="세션 시작 이후"
                    icon={Activity}
                    color="text-blue-400"
                />
                <MetricCard
                    label="성공"
                    value={stats.successCount}
                    sub={`실패: ${stats.failCount}`}
                    icon={Activity}
                    color="text-green-400"
                />
                <MetricCard
                    label="에러율"
                    value={`${errorRate}%`}
                    sub={stats.totalCalls > 0 ? `${stats.failCount}/${stats.totalCalls}` : '-'}
                    icon={Activity}
                    color={parseFloat(errorRate) > 10 ? 'text-red-400' : 'text-green-400'}
                />
                <MetricCard
                    label="평균 응답시간"
                    value={`${stats.avgLatency}ms`}
                    sub={stats.totalCalls > 0 ? '캐시 포함' : '-'}
                    icon={Activity}
                    color="text-amber-400"
                />
            </div>

            {/* Cache Status */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Database className="w-5 h-5 text-purple-400" />
                        캐시 상태
                    </h3>
                    <button
                        onClick={handleClearCache}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1.5 text-sm"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        캐시 삭제
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">캐시된 응답</div>
                        <div className="text-2xl font-bold text-white mt-1">{stats.cacheSize}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">TTL</div>
                        <div className="text-2xl font-bold text-white mt-1">{stats.cacheTTL / 60}분</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">상태</div>
                        <div className="text-2xl font-bold text-green-400 mt-1">활성</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemMonitor;
