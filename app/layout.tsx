import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"

const geistSans = { variable: "--font-geist-sans" }
const geistMono = { variable: "--font-geist-mono" }

export const metadata: Metadata = {
  title: "Global Compound Interest Calculator",
  description: "Calculate your compound interest growth with monthly contributions. Visualize your wealth over time.",
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
