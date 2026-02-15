import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { callOpenAI } from '../lib/openai';

const UltimateEconomySim = ({ apiKey }) => {
    const [fedRate, setFedRate] = useState(2.5);
    const [data, setData] = useState([]);
    const [aiResult, setAiResult] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);

    useEffect(() => {
        const points = [];
        for (let i = 0; i <= 10; i++) {
            const exchangeRate = 1100 + (fedRate * 80) + (i * 10);
            const stockUsd = 100 + (i * 8) - (fedRate * 2);
            const goldUsd = 100 + (i * 15) + (fedRate < 3 ? 20 : -5);
            const stockKrw = (stockUsd * (exchangeRate / 1200)).toFixed(1);
            const goldKrw = (goldUsd * (exchangeRate / 1200)).toFixed(1);

            points.push({
                name: `T+${i}`,
                exchangeRate: exchangeRate.toFixed(0),
                stockKrw: parseFloat(stockKrw),
                goldKrw: parseFloat(goldKrw),
                bond: parseFloat((100 - (fedRate * 5) + i).toFixed(1))
            });
        }
        setData(points);
    }, [fedRate]);

    const lastPoint = data[data.length - 1];

    const runAiAnalysis = async () => {
        if (!apiKey) {
            setAiError('OpenAI API 키를 먼저 설정해주세요. (상단 ⚙️ 버튼)');
            return;
        }
        setAiLoading(true);
        setAiError(null);
        setAiResult(null);

        try {
            const result = await callOpenAI(
                apiKey,
                '당신은 거시경제 애널리스트입니다. 한국 개인투자자 관점에서 실용적인 제안을 한국어로 작성하세요. **bold** 마크다운을 사용하세요.',
                `현재 시뮬레이션 데이터:
- Fed 금리: ${fedRate}%
- 예상 환율: ${lastPoint?.exchangeRate} KRW/USD
- S&P500(원화환산): ${lastPoint?.stockKrw}
- Gold(원화환산): ${lastPoint?.goldKrw}
- 미국채(AGG): ${lastPoint?.bond}

요청사항:
1) 현재 국면 진단 2문장
2) 한국 투자자용 액션 아이템 3개
3) 리스크 경고 2개
마크다운 불릿으로 간결하게 작성`
            );
            setAiResult(result);
        } catch (e) {
            setAiError(e.message);
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="p-5 bg-slate-900 text-slate-50 rounded-2xl font-sans">
            <h2 className="text-sky-400 mb-6 text-xl font-bold">
                🇰🇷 한-미 금리/환율 자산 시뮬레이터 (2026)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-5 mb-5">
                <div className="bg-slate-800 p-5 rounded-xl">
                    <p className="mb-2.5 text-lg">
                        🇺🇸 <strong>미국 연준 금리: {fedRate}%</strong>
                    </p>
                    <input
                        type="range" min="0" max="10" step="0.25"
                        value={fedRate}
                        onChange={(e) => setFedRate(parseFloat(e.target.value))}
                        className="w-full accent-sky-400 cursor-pointer"
                    />
                    <p className="text-[13px] text-slate-400 mt-2.5">
                        * 금리 상승 → 달러 가치 상승 → <strong className="text-slate-300">원/달러 환율 상승</strong>
                    </p>
                </div>
                <div className="bg-sky-700 p-5 rounded-xl text-center flex flex-col justify-center">
                    <span className="text-sm text-sky-100">예상 환율 (USD/KRW)</span>
                    <div className="text-3xl font-bold my-1">₩{lastPoint?.exchangeRate}</div>
                </div>
            </div>

            <div className="h-[400px] bg-slate-800 p-5 rounded-xl border border-slate-700">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
                            labelStyle={{ color: '#94a3b8' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px', color: '#94a3b8' }} />
                        <Line type="monotone" dataKey="stockKrw" stroke="#3b82f6" name="S&P 500 (원화 환산)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="goldKrw" stroke="#eab308" name="금 (원화 환산)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="bond" stroke="#f87171" name="미국 채권 (AGG)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* AI Market Analysis */}
            <div className="mt-5 p-5 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-purple-300 font-bold flex items-center gap-2">
                        🤖 AI 마켓 분석
                    </h3>
                    <button
                        onClick={runAiAnalysis}
                        disabled={aiLoading}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-semibold hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {aiLoading ? '분석 중...' : '분석 실행'}
                    </button>
                </div>

                {aiLoading && (
                    <div className="flex items-center gap-3 text-purple-300 py-4">
                        <div className="w-5 h-5 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                        OpenAI에서 시장 분석을 생성하고 있습니다...
                    </div>
                )}

                {aiError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {aiError}
                    </div>
                )}

                {aiResult && (
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {aiResult.cached && (
                            <div className="text-xs text-purple-400 mb-2 flex items-center gap-1">
                                ⚡ 캐시된 응답 (30분 TTL)
                            </div>
                        )}
                        <div dangerouslySetInnerHTML={{
                            __html: aiResult.text
                                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                                .replace(/\n/g, '<br/>')
                        }} />
                    </div>
                )}

                {!aiLoading && !aiError && !aiResult && (
                    <p className="text-slate-500 text-sm">
                        금리를 조절한 후 "분석 실행" 버튼을 눌러 AI 기반 시장 분석을 받아보세요.
                        {!apiKey && <span className="text-amber-400 block mt-1">⚠️ 먼저 상단의 ⚙️ 버튼으로 OpenAI API 키를 설정하세요.</span>}
                    </p>
                )}
            </div>

            {/* Static Analysis */}
            <div className="mt-5 p-5 bg-slate-800 rounded-xl text-[15px] leading-relaxed border border-slate-700">
                <strong className="block mb-2.5 text-sky-400">💡 한국 투자자를 위한 분석:</strong>
                <ul className="pl-5 text-slate-300 m-0 space-y-2">
                    <li>미국 금리가 오르면 <strong>채권(AGG)</strong>은 하락 압력을 받습니다.</li>
                    <li>하지만 <strong>금(GLD)</strong>과 <strong>주식(S&P 500)</strong>은 자산 자체의 상승에 <strong className="text-amber-400">환차익</strong>까지 더해져 원화 기준 수익률이 더 가팔라집니다.</li>
                    <li>이것이 바로 '기축통화 자산'을 보유해야 하는 이유이며, <strong className="text-sky-400">리밸런싱</strong>의 핵심 근거가 됩니다.</li>
                </ul>
            </div>
        </div>
    );
};

export default UltimateEconomySim;
