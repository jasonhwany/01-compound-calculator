# Global Compound Interest Calculator — CLAUDE.md

> 이 파일은 맥북/서피스 멀티 환경에서 작업해도 Claude가 프로젝트 상황을 파악할 수 있도록 유지하는 기억 장치입니다.

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 서비스명 | Global Compound Interest Calculator |
| 상위 프로젝트 | Global-Tools-Hub (10개 서비스 공장) |
| 목적 | 복리 계산기 — 원금/이율/기간/납입 방식을 입력하면 최종 금액과 이자 시각화 |
| 경로 | `~/Desktop/Global-Tools-Hub/01-compound-calculator` |

## 기술 스택

- **Framework**: Next.js 16.2.2 (App Router) — `create-next-app@latest` 설치 기준
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint
- **Import Alias**: `@/*`
- **src/ 디렉토리**: 미사용 (루트에 `app/` 직접 위치)

> ⚠️ 요청은 Next.js 14였으나, `create-next-app@latest` 실행 시 16.2.2가 설치됨. App Router 구조는 동일하게 적용.

## 폴더 구조

```
01-compound-calculator/
├── app/
│   ├── layout.tsx       # 루트 레이아웃
│   ├── page.tsx         # 메인 페이지 (계산기 UI)
│   └── globals.css      # 글로벌 스타일
├── components/          # (예정) 재사용 컴포넌트
├── lib/                 # (예정) 계산 로직 유틸
├── public/
├── CLAUDE.md            # 이 파일
└── ...
```

## 진행 상황

### ✅ Phase 1 — 환경 구축 (완료: 2026-04-01)
- [x] `create-next-app` 으로 프로젝트 초기화
- [x] TypeScript + Tailwind + App Router 설정 확인
- [x] CLAUDE.md 생성

### ✅ Phase 2 — 계산기 핵심 로직 (완료: 2026-04-01)
- [x] shadcn/ui 설치 (card, input, label, slider)
- [x] 복리 계산 함수 작성 (`lib/calculator.ts`)
  - `calculateCompoundInterest()` — 월 복리, 연도별 breakdown 포함
  - `formatCurrency()` — Intl.NumberFormat USD 포맷
- [x] 메인 페이지 대시보드 UI (`app/page.tsx`)
  - 입력 폼: 원금, 연이율, 기간, 월 납입액
  - 결과 히어로: 총 자산, 총 원금, 총 이자 수익 (3분할)
  - 원금/이자 비율 Progress Bar
  - 연도별 Breakdown 스크롤 테이블
  - Quick Presets 3종 (Conservative / Balanced / Aggressive)
- [x] 반응형 레이아웃 (모바일 → lg: 5컬럼 그리드)
- [x] `npm run build` 성공 (TypeScript errors: 0)

### 🔲 Phase 3 — 시각화 (차트)
- [ ] Recharts 설치
- [ ] 연도별 성장 Area Chart (원금 vs 이자 스택)
- [ ] 모바일 최적화 차트 크기

### 🔲 Phase 4 — 글로벌 대응
- [ ] 다국어 지원 (next-intl)
- [ ] 통화 단위 선택 (USD, KRW, EUR 등)
- [ ] SEO 메타데이터 설정

### 🔲 Phase 5 — 배포
- [ ] Vercel 배포
- [ ] 커스텀 도메인 연결 (예정)

## 작업 컨벤션

- 파일 크기: 800줄 이하, 함수 50줄 이하
- 불변성 패턴 사용 (mutation 금지)
- 입력값은 zod로 검증
- 컴포넌트는 `components/` 에 분리, 계산 로직은 `lib/` 에 분리

## GitHub / 배포 정보

| 항목 | 내용 |
|------|------|
| GitHub | https://github.com/jasonhwany/01-compound-calculator |
| Remote | SSH (`git@github.com:jasonhwany/01-compound-calculator.git`) |
| Vercel | GitHub 연동 후 자동 배포 (아래 참고) |
| Branch | `main` |

### Vercel 연동 방법 (최초 1회)
1. https://vercel.com 접속 → GitHub 로그인
2. **Add New Project** → `01-compound-calculator` 리포 선택
3. Framework: Next.js 자동 감지 → **Deploy** 클릭
4. 이후 `main` push 시 자동 배포

## 작업 일지

### 2026-04-01 (맥북)
- Phase 1: Next.js 16.2.2 프로젝트 초기화 완료
- Phase 2: shadcn/ui + 복리 계산기 핵심 기능 전체 구현
  - `lib/calculator.ts` — 월 복리 엔진, 연도별 breakdown
  - `app/page.tsx` — 대시보드 UI (입력폼 + 결과 3분할 + 진행바 + 테이블 + 프리셋)
  - 빌드 성공 (TypeScript errors: 0)
- GitHub push 완료 (SSH 방식)

## 다음 작업 (resume 시 여기서 시작)

**Phase 3** — Recharts 성장 차트 추가
1. `npm install recharts` 설치
2. `components/GrowthChart.tsx` — Area Chart (원금 vs 이자 누적 스택)
3. `app/page.tsx` 하단에 차트 섹션 삽입
4. Vercel 첫 배포 완료 확인
