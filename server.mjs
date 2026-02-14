import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';

const envPath = '.env';
if (existsSync(envPath)) {
  const envLines = readFileSync(envPath, 'utf8').split('\n');
  envLines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return;
    const index = trimmed.indexOf('=');
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

const port = Number(process.env.OPENAI_BACKEND_PORT || 8787);

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
};

const parseBody = async (req) => {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }

  return body ? JSON.parse(body) : {};
};

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (req.url === '/api/health' && req.method === 'GET') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.url === '/api/analysis' && req.method === 'POST') {
    try {
      const { fedRate, exchangeRate, stockKrw, goldKrw, bond } = await parseBody(req);
      const values = [fedRate, exchangeRate, stockKrw, goldKrw, bond].map(Number);

      if (!values.every(Number.isFinite)) {
        sendJson(res, 400, { error: '유효한 시뮬레이션 데이터가 필요합니다.' });
        return;
      }

      if (!process.env.OPENAI_API_KEY) {
        sendJson(res, 500, { error: 'OPENAI_API_KEY가 설정되지 않았습니다.' });
        return;
      }

      const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
      const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          input: [
            {
              role: 'system',
              content: '당신은 거시경제 애널리스트입니다. 한국 개인투자자 관점에서 실용적인 제안을 한국어로 작성하세요.'
            },
            {
              role: 'user',
              content: `현재 시뮬레이션 데이터입니다.\n- Fed 금리: ${fedRate}%\n- 예상 환율: ${exchangeRate} KRW/USD\n- S&P500(원화환산): ${stockKrw}\n- Gold(원화환산): ${goldKrw}\n- 미국채(AGG): ${bond}\n\n요청사항:\n1) 현재 국면 진단 2문장\n2) 한국 투자자용 액션 아이템 3개\n3) 리스크 경고 2개\n마크다운 불릿으로 간결하게 작성`
            }
          ]
        })
      });

      const result = await openAiResponse.json();
      if (!openAiResponse.ok) {
        sendJson(res, 500, { error: 'OpenAI 분석 중 오류가 발생했습니다.', detail: result.error?.message });
        return;
      }

      sendJson(res, 200, { analysis: result.output_text || '분석 결과를 생성하지 못했습니다.' });
      return;
    } catch (error) {
      sendJson(res, 500, { error: '요청 처리 중 오류가 발생했습니다.', detail: error.message });
      return;
    }
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(port, () => {
  console.log(`OpenAI backend listening on ${port}`);
});
