import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"

const geistSans = { variable: "--font-geist-sans" }
const geistMono = { variable: "--font-geist-mono" }

const BASE_URL = "https://calc.moneystom7.com"

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is a compound interest calculator?", acceptedAnswer: { "@type": "Answer", text: "A compound interest calculator shows how your investment grows when interest is earned on both the principal and previously accumulated interest, with support for monthly contributions." } },
    { "@type": "Question", name: "How much do I need to save monthly to reach my financial goal?", acceptedAnswer: { "@type": "Answer", text: "Use the Goal Calculator tab — enter your target amount, annual rate, and investment period to instantly calculate the required monthly contribution." } },
    { "@type": "Question", name: "What is the difference between compound and simple interest?", acceptedAnswer: { "@type": "Answer", text: "Simple interest is calculated only on the principal. Compound interest is calculated on the principal plus all previously earned interest, resulting in exponential growth over time." } },
    { "@type": "Question", name: "복리 계산기란 무엇인가요?", acceptedAnswer: { "@type": "Answer", text: "복리 계산기는 원금과 이자에 다시 이자가 붙는 복리 효과를 계산하는 도구입니다. 월 납입액을 포함하여 장기 투자 시 미래 자산을 예측합니다." } },
  ],
}

export const metadata: Metadata = {
  title: "복리 계산기 — MoneyStom7 | Compound Interest Calculator",
  description:
    "원금·이율·기간으로 미래 자산을 계산하세요. 월 납입액 포함 복리 계산기. Free compound interest calculator with monthly contributions.",
  keywords: [
    "복리 계산기",
    "compound interest calculator",
    "investment calculator",
    "savings calculator",
    "월 납입 계산기",
    "재테크 계산기",
    "interest rate calculator",
  ],
  authors: [{ name: "MoneyStom7" }],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "복리 계산기 — MoneyStom7",
    description:
      "원금·이율·기간으로 미래 자산을 계산하세요. 월 납입액 포함 복리 계산기.",
    url: BASE_URL,
    siteName: "MoneyStom7",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compound Interest Calculator – Free Online Tool",
    description:
      "Calculate compound interest instantly. See how your savings grow with monthly contributions and interest rate.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Script id="faq-json-ld" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-GN51TN6PS4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GN51TN6PS4');
          `}
        </Script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8414331859152952"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
