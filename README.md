# 🌐 CurrencyDashboard - AI Macro-Economic Investment Platform

미국 거시경제(Macro-Economy) 및 기축통화(Anchor Currency)의 원리를 시각적으로 체험하고, AI 알고리즘(ML & 몬테카를로)을 활용해 최적의 모의 투자 자산군 포트폴리오를 제공받을 수 있는 인터랙티브 대시보드입니다.

![Dashboard Preview](./preview.png)

### 🌍 **[Live Demo (GitHub Pages)](https://sechan9999.github.io/CurrencyDashboard/)**

> **Note**: GitHub Pages 버전은 완전한 브라우저 클라이언트 전용(Frontend Only)으로 동작합니다. 실제 라이브 FRED API, Python XG-Boost 머신러닝, 몬테카를로(Monte-Carlo) 등 실제 로컬 백엔드가 요구되는 기능들은 GitHub Pages에서는 데모 모드(Simulated Mock Data)로 자연스럽게 작동하도록 Fallback 처리되어 있습니다. 모든 실제 백엔드 시뮬레이션을 돌리려면 본 저장소를 클론하여 로컬에서 `run_local_dashboard.bat`을 실행해 보세요!

---

## ✨ 핵심 기능 (Features)

### 1. 🤖 AI 투자 플랫폼 (AI Macro-Economic Investment Platform)
- **FRED Data Pipeline**: 미국 연준 API 인플레이션(CPI), 기준금리, 달러 인덱스(DXY) 실시간 연동
- **Machine Learning**: XGBoost 기반의 USD/KRW 환율 예측 모델
- **Risk Simulation**: 몬테카를로 시뮬레이션(Geometric Brownian Motion)을 통한 자산가치 분포 분석
- **Portfolio Optimizer**: 현대 포트폴리오 이론(MPT)에 기반한 최적 자산배분 (Mean-Variance, 최대 Sharpe Ratio)
- **Azure OpenAI Insights**: GPT-4o를 이용한 매크로 투자 전략 코멘트 제공

### 2. 💸 기축통화 시뮬레이터 (Anchor Currency Simulator)
- 미국 기준금리를 조절하며 자본 흐름, 무역 결제, 각국의 가치 저장/외환보유고를 직관적으로 체험

### 3. 📈 시스템 모니터링
- 백엔드와 프론트엔드 환경에서 넘어오는 데이터를 실시간으로 모니터링
- 미국 시장 지표 변화 추이 렌더링

---

## 🚀 로컬 환경 구축 및 실행 방법 (Local Setup)

Python FastAPI 기반의 실제 매크로 경제 분석 백엔드를 구동하려면 다음 단계를 따릅니다.

### 필수 요구사항
- Node.js 18.0 이상
- Python 3.10 이상 

### 시작하기

```bash
# 1. 저장소 클론
git clone https://github.com/sechan9999/CurrencyDashboard.git
cd CurrencyDashboard

# 2. 패키지 설치
npm install

# 3. 로컬 앱 전체 구동 스크립트 실행 (한번에 Frontend/Backend 동시 실행)
.\run_local_dashboard.bat
```

> **API Key 연동 설정**: FastAPI 백엔드의 `backend/.env` 파일 또는 코드 내에 `FRED_API_KEY`와 `AZURE_OPENAI_KEY`를 설정하면 실데이터 기반으로 100% 동작합니다. (키가 없으면 테스트용 Mock 데이터가 자동으로 생성됩니다)

---

## 🛠️ 기술 스택 (Tech Stack)

### Frontend
- **React 18** (Vite 환경)
- **Tailwind CSS** (퍼포먼스 및 스타일링)
- **Recharts** (데이터 시각화)

### Backend (AI & Data Pipeline)
- **Python / FastAPI** (비동기 빠른 속도의 Rest API 구성)
- **Pandas / NumPy / SciPy** (MPT 포트폴리오 연산 및 금융 데이터 전처리)
- **XGBoost** (환율 타겟팅을 위한 실시간 부스팅 트리 모델)
- **OpenAI (Azure)** (투자 전략가 역할의 자율 페르소나 적용)

---

## 🤝 기여하기 (Contributing)

기여를 환영합니다! 다음 단계를 따라주세요:
1. 이 저장소를 Fork 합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/NewFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add NewFeature'`)
4. 브랜치에 Push 합니다 (`git push origin feature/NewFeature`)
5. Pull Request를 생성합니다

## 📝 라이선스
MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
