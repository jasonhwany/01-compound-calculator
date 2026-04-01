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

### 🔲 Phase 2 — 계산기 핵심 로직
- [ ] 복리 계산 함수 작성 (`lib/calculator.ts`)
- [ ] 입력 폼 컴포넌트 (원금, 연이율, 기간, 납입 방식)
- [ ] 결과 출력 컴포넌트 (최종 금액, 총 이자, 원금 비율)

### 🔲 Phase 3 — 시각화 & UI
- [ ] 차트 라이브러리 도입 (Recharts 예정)
- [ ] 연도별 성장 그래프
- [ ] 반응형 레이아웃 (모바일 우선)

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

## 다음 작업 (resume 시 여기서 시작)

**Phase 2 시작** — 복리 계산 로직 구현
1. `lib/calculator.ts` 작성
2. 메인 페이지 UI 폼 구현
