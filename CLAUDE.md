# Global Compound Interest Calculator — CLAUDE.md

> 맥북/서피스 멀티 환경에서 Claude가 즉시 상황을 파악할 수 있도록 유지하는 기억 장치.
> **서피스에서 resume 시 → "내일 아침 첫 번째 할 일" 섹션부터 읽을 것.**

---

## 🚨 내일 아침 첫 번째 할 일 (2026-04-02, 출근 후 즉시)

### Step 1 — Vercel 빌드 결과 확인

어젯밤 자기 전에 다음 커밋을 push했음:
```
3398576  fix: output: export 설정 — Vercel 정적 배포 404 수정
```

Vercel 대시보드 접속 → **배포 상태 확인**
- ✅ Ready + 사이트 정상 접속 → Step 2(Phase 3 차트) 바로 시작
- ❌ 여전히 404 → 아래 추가 조치 실행

### Step 2 — 만약 여전히 404일 경우 추가 조치

**원인 분석:**
Next.js 16.2.2는 Vercel의 현재 Next.js 서버 통합과 충돌함.
- Vercel이 빌드는 성공(Ready)시키지만 라우팅 서빙이 안 됨
- `output: "export"` 설정으로 정적 HTML 강제 생성하여 우회

**추가 조치 옵션 A — Vercel 출력 디렉토리 수동 지정:**
Vercel 대시보드 → Settings → Build & Output Settings
- Output Directory: `out` 으로 변경 후 Redeploy

**추가 조치 옵션 B — vercel.json 추가:**
```bash
cd ~/Desktop/Global-Tools-Hub/01-compound-calculator
```
아래 파일 생성 후 push:
```json
{
  "outputDirectory": "out",
  "buildCommand": "npm run build"
}
```

**추가 조치 옵션 C — 프레임워크 Other로 변경:**
Vercel 대시보드 → Settings → General → Framework Preset을 `Other`로 변경 후 Redeploy

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 서비스명 | Global Compound Interest Calculator |
| 상위 프로젝트 | Global-Tools-Hub (10개 서비스 공장) |
| 로컬 경로 (맥북) | `~/Desktop/Global-Tools-Hub/01-compound-calculator` |
| GitHub | https://github.com/jasonhwany/01-compound-calculator |
| Vercel | https://01-compound-calculator-dfxd.vercel.app |
| Remote | SSH (`git@github.com:jasonhwany/01-compound-calculator.git`) |
| Branch | `main` — push 시 Vercel 자동 배포 |

## 기술 스택

| 항목 | 내용 |
|------|------|
| Framework | Next.js 16.2.2 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI 컴포넌트 | shadcn/ui (base-nova 스타일) |
| 배포 방식 | `output: "export"` 정적 빌드 → Vercel |
| Import Alias | `@/*` → 루트 |

> ⚠️ Next.js 14 요청이었으나 `create-next-app@latest`로 16.2.2 설치됨
> ⚠️ Tailwind v4 — 기존 `tailwind.config.js` 없음, `globals.css`에서 `@import "tailwindcss"` 방식 사용

## 폴더 구조 (현재 상태)

```
01-compound-calculator/
├── app/
│   ├── layout.tsx       # 메타데이터: "Global Compound Interest Calculator"
│   ├── page.tsx         # 메인 계산기 페이지 ("use client")
│   └── globals.css      # Tailwind v4 + shadcn 테마
├── components/
│   └── ui/              # shadcn 컴포넌트
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── slider.tsx
├── lib/
│   ├── calculator.ts    # 복리 계산 엔진
│   └── utils.ts         # shadcn cn() 유틸
├── public/
├── next.config.ts       # output: "export" 설정됨
├── CLAUDE.md            # 이 파일
└── ...
```

## 구현된 기능 (Phase 2 완료)

### `lib/calculator.ts`
- `calculateCompoundInterest(input)` — 월 복리 계산
  - 입력: principal, annualRate, years, monthlyContribution
  - 출력: totalValue, totalPrincipal, totalInterest, yearlyBreakdown[]
- `formatCurrency(value)` — USD 포맷 (Intl.NumberFormat)

### `app/page.tsx` — 대시보드 UI
- **입력 폼**: 원금($), 연이율(%), 기간(yrs), 월 납입액($)
- **결과 히어로 카드**: Total Future Value (크게 표시)
- **분할 카드**: Total Principal (파란색) + Interest Earned (초록색)
- **Progress Bar**: 원금/이자 비율 애니메이션
- **Year-by-Year 테이블**: 연도별 자산/원금/이자 스크롤
- **Quick Presets**: Conservative(4%/30yr) / Balanced(7%/20yr) / Aggressive(12%/15yr)
- **반응형**: 모바일 1열 → lg 5컬럼 그리드
- **테마**: 다크 슬레이트 배경 + 에메랄드 포인트

---

## 전체 작업 일지

### 2026-04-01 (맥북, 저녁)

| 시간 | 작업 | 결과 |
|------|------|------|
| Phase 1 | Next.js 16.2.2 프로젝트 초기화 | ✅ |
| Phase 1 | CLAUDE.md 생성 | ✅ |
| Phase 2 | shadcn/ui 설치 (card/input/label/slider) | ✅ |
| Phase 2 | `lib/calculator.ts` 복리 계산 엔진 구현 | ✅ |
| Phase 2 | `app/page.tsx` 대시보드 UI 전체 구현 | ✅ |
| Phase 2 | `npm run build` 성공 (TypeScript errors: 0) | ✅ |
| 배포 | GitHub SSH push 완료 | ✅ |
| 배포 | Vercel 연동 (GitHub 자동 배포) | ✅ |
| 배포 | 404 오류 발생 → `output: export` 수정 push | ✅ |
| 배포 | Vercel 재빌드 중 (취침 전 상태) | ⏳ |

---

## 남은 작업 (Phase 3~5)

### 🔲 Phase 3 — 시각화 차트 (다음 작업)
- [ ] `npm install recharts`
- [ ] `components/GrowthChart.tsx` — Area Chart (원금 vs 이자 누적 스택)
- [ ] `app/page.tsx` 하단 차트 섹션 삽입

### 🔲 Phase 4 — 글로벌 대응
- [ ] 통화 단위 선택 (USD / KRW / EUR)
- [ ] SEO 메타데이터 (`og:image`, `twitter:card`)
- [ ] 다국어 지원 (next-intl, 추후 검토)

### 🔲 Phase 5 — 배포 완성
- [ ] Vercel 404 최종 해결 확인
- [ ] 커스텀 도메인 연결 (미정)
- [ ] Google Analytics 연동 (선택)

---

## 개발 환경 세팅 (서피스에서 clone 후 실행 시)

```bash
# 1. 레포 클론
git clone git@github.com:jasonhwany/01-compound-calculator.git
cd 01-compound-calculator

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
# → http://localhost:3000
```

> SSH 키가 없으면 HTTPS로 클론:
> `git clone https://github.com/jasonhwany/01-compound-calculator.git`

## 작업 컨벤션

- 불변성 패턴 (mutation 금지)
- 파일 800줄 이하, 함수 50줄 이하
- 컴포넌트 → `components/`, 로직 → `lib/`
- 커밋 후 반드시 `git push` (서피스 동기화 목적)
