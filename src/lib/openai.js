// OpenAI client with stats tracking and response caching

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const cache = new Map();
const stats = {
    totalCalls: 0,
    successCount: 0,
    failCount: 0,
    totalLatency: 0,
    lastCallTime: null,
};

function getCacheKey(systemPrompt, userMessage) {
    return `${systemPrompt}::${userMessage}`;
}

export async function callOpenAI(apiKey, systemPrompt, userMessage) {
    if (!apiKey) throw new Error('API 키가 필요합니다.');

    // Check cache
    const key = getCacheKey(systemPrompt, userMessage);
    const cached = cache.get(key);
    if (cached && Date.now() - cached.time < CACHE_TTL) {
        return { text: cached.text, cached: true };
    }

    stats.totalCalls++;
    stats.lastCallTime = new Date().toISOString();
    const start = Date.now();

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage },
                ],
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error?.message || `HTTP ${res.status}`);
        }

        const data = await res.json();
        const text = data.choices[0].message.content;
        const latency = Date.now() - start;

        stats.successCount++;
        stats.totalLatency += latency;

        // Cache result
        cache.set(key, { text, time: Date.now() });

        return { text, cached: false, latency };
    } catch (e) {
        stats.failCount++;
        stats.totalLatency += Date.now() - start;
        throw e;
    }
}

export async function testApiKey(apiKey) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: 'Reply OK' }],
            max_tokens: 5,
        }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Invalid API key');
    }
    return true;
}

export function getStats() {
    return {
        ...stats,
        avgLatency: stats.totalCalls > 0 ? Math.round(stats.totalLatency / stats.totalCalls) : 0,
        cacheSize: cache.size,
        cacheTTL: CACHE_TTL / 1000,
    };
}

export function clearCache() {
    cache.clear();
}
