import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "복리 계산기 — 월 적립식 이자 계산 무료 | Global Tools Hub",
  description:
    "복리 계산기로 초기 투자금과 월 납입액 입력 시 미래 자산을 즉시 계산. 목표 금액 역산, 시나리오 비교, 인플레이션 조정, CSV 다운로드 기능 제공. 무료, 회원가입 불필요.",
  keywords: [
    "복리 계산기",
    "월 적립식 복리 계산기",
    "이자 계산기",
    "투자 수익 계산기",
    "복리 계산 공식",
    "노후 자금 계산기",
    "목표 저축 계산기",
    "연금 계산기",
    "적금 복리 계산",
    "재테크 계산기",
  ],
  alternates: {
    canonical: "/ko",
    languages: { "en": "/", "ko": "/ko" },
  },
  openGraph: {
    title: "복리 계산기 — 월 적립식 이자 계산 무료",
    description: "초기 투자금과 월 납입액으로 미래 자산 즉시 계산. 목표 역산·시나리오 비교·인플레이션 조정 기능 포함.",
    url: "https://calc.moneystom7.com/ko",
    siteName: "Global Tools Hub",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "복리 계산기 — 월 적립식 이자 계산 무료",
    description: "초기 투자금과 월 납입액으로 미래 자산 즉시 계산. 목표 역산·시나리오 비교 기능 포함.",
  },
}

export default function KoLayout({ children }: { children: React.ReactNode }) {
  return children
}
