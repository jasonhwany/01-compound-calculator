import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"

const geistSans = { variable: "--font-geist-sans" }
const geistMono = { variable: "--font-geist-mono" }

const BASE_URL = "https://01-compound-calculator.vercel.app"

export const metadata: Metadata = {
  title: "Compound Interest Calculator – Free Online Tool | Global Tools Hub",
  description:
    "Calculate compound interest instantly. See how your savings grow with monthly contributions, annual interest rate, and investment period. Free, no sign-up required.",
  keywords: [
    "compound interest calculator",
    "investment calculator",
    "savings calculator",
    "compound interest formula",
    "monthly contribution calculator",
    "wealth growth calculator",
    "interest rate calculator",
  ],
  authors: [{ name: "Global Tools Hub" }],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Compound Interest Calculator – Free Online Tool",
    description:
      "Calculate compound interest instantly. See how your savings grow with monthly contributions, annual interest rate, and investment period.",
    url: BASE_URL,
    siteName: "Global Tools Hub",
    type: "website",
    locale: "en_US",
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
