"use client"

import Script from "next/script"
import Link from "next/link"
import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  calculateCompoundInterest, formatCurrency, downloadCSV,
  type CalculatorInput, type CompoundingFrequency
} from "@/lib/calculator"
import GrowthChart from "@/components/GrowthChart"
import AdUnit from "@/components/AdUnit"
import GoalCalculator from "@/components/GoalCalculator"
import ScenarioComparison from "@/components/ScenarioComparison"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Compound Interest Calculator",
  url: "https://01-compound-calculator.vercel.app",
  description: "Free online compound interest calculator with goal planner, scenario comparison, inflation adjustment, and CSV export.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Compound interest calculation",
    "Goal reverse calculator",
    "Scenario comparison",
    "Inflation adjustment",
    "Compounding frequency selector",
    "CSV export",
    "URL sharing",
  ],
}

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD" },
  { code: "KRW", symbol: "₩", label: "KRW" },
  { code: "EUR", symbol: "€", label: "EUR" },
] as const
type CurrencyCode = "USD" | "KRW" | "EUR"

const FAQ_EN = [
  { q: "What is a compound interest calculator?", a: "A compound interest calculator shows how your investment grows when interest is earned on both the principal and previously accumulated interest. It helps you project the future value of investments with regular monthly contributions." },
  { q: "What is the difference between compound and simple interest?", a: "Simple interest is calculated only on the principal, while compound interest is calculated on the principal plus all previously earned interest. Over long periods, the difference is dramatic — compound interest can turn a modest monthly savings into significant wealth." },
  { q: "How much do I need to save monthly to reach my goal?", a: "Use the 'Goal Calculator' tab. Enter your target amount, annual rate, and investment period, and the calculator instantly tells you the required monthly contribution." },
  { q: "Which compounding frequency is best — monthly, quarterly, or annual?", a: "Monthly compounding yields slightly more than quarterly or annual compounding at the same annual rate. Most savings accounts, ETFs, and mutual funds compound monthly." },
  { q: "Should I account for inflation in my calculations?", a: "Yes — inflation erodes purchasing power over time. Toggle on 'Inflation Adjustment' and enter the expected inflation rate (typically 2–3%) to see the real value of your future wealth." },
]

const TABS = [
  { id: "calculator", label: "계산기" },
  { id: "goal", label: "목표 역산" },
  { id: "compare", label: "시나리오 비교" },
] as const
type TabId = typeof TABS[number]["id"]

const DEFAULT_INPUT: CalculatorInput = { principal: 10000, annualRate: 7, years: 20, monthlyContribution: 500 }

function parseNumber(v: string) {
  const n = parseFloat(v.replace(/,/g, ""))
  return isNaN(n) ? 0 : n
}

export default function CompoundCalculatorPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [tab, setTab] = useState<TabId>("calculator")
  const [input, setInput] = useState<CalculatorInput>(DEFAULT_INPUT)
  const [currency, setCurrency] = useState<CurrencyCode>("USD")
  const [frequency, setFrequency] = useState<CompoundingFrequency>("monthly")
  const [inflationRate, setInflationRate] = useState(0)
  const [showInflation, setShowInflation] = useState(false)
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => calculateCompoundInterest({ ...input, frequency, inflationRate: showInflation ? inflationRate : 0 }), [input, frequency, inflationRate, showInflation])
  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol ?? "$"
  const fmt = (v: number) => formatCurrency(v, currency)

  const principalRatio = result.totalValue > 0 ? Math.round((result.totalPrincipal / result.totalValue) * 100) : 0
  const interestRatio = 100 - principalRatio

  function handleChange(field: keyof CalculatorInput, value: string) {
    setInput(prev => ({ ...prev, [field]: parseNumber(value) }))
  }

  const handleShare = useCallback(() => {
    const params = new URLSearchParams({
      p: String(input.principal),
      r: String(input.annualRate),
      y: String(input.years),
      m: String(input.monthlyContribution),
      f: frequency,
      c: currency,
    })
    const url = `${window.location.origin}?${params.toString()}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [input, frequency, currency])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8 md:py-12">
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center gap-3 text-xs">
            <span className="text-emerald-400 font-semibold">🌐 English</span>
            <Link href="/ko" className="text-slate-500 hover:text-slate-300 transition-colors">🇰🇷 한국어</Link>
          </div>
          <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase">Global Tools Hub</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">Compound Interest Calculator</h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            Watch your money grow with the power of compounding.
          </p>
          {/* Currency Selector */}
          <div className="flex justify-center gap-2 pt-2">
            {CURRENCIES.map(c => (
              <button key={c.code} onClick={() => setCurrency(c.code)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  currency === c.code
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-slate-800 text-slate-400 border-slate-600 hover:border-emerald-500/50 hover:text-slate-200"
                }`}>
                {c.symbol} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ad — 헤더 하단 */}
        <AdUnit slot="5648421888" format="horizontal" className="w-full" />

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/50">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                tab === t.id
                  ? "bg-emerald-500 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ─── Tab: 계산기 ─── */}
        {tab === "calculator" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Input Panel */}
              <Card className="lg:col-span-2 bg-slate-800/60 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs">✎</span>
                    Your Numbers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">

                  <div className="space-y-2">
                    <Label htmlFor="principal" className="text-slate-300 text-sm">Initial Investment</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{currencySymbol}</span>
                      <Input id="principal" type="number" min={0} value={input.principal || ""}
                        onChange={e => handleChange("principal", e.target.value)}
                        className="pl-7 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500"
                        placeholder="10,000" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="annualRate" className="text-slate-300 text-sm">Annual Interest Rate</Label>
                    <div className="relative">
                      <Input id="annualRate" type="number" min={0} max={100} step={0.1} value={input.annualRate || ""}
                        onChange={e => handleChange("annualRate", e.target.value)}
                        className="pr-8 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500"
                        placeholder="7" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="years" className="text-slate-300 text-sm">Investment Period</Label>
                    <div className="relative">
                      <Input id="years" type="number" min={1} max={50} value={input.years || ""}
                        onChange={e => handleChange("years", e.target.value)}
                        className="pr-14 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500"
                        placeholder="20" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">yrs</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyContribution" className="text-slate-300 text-sm">Monthly Contribution</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{currencySymbol}</span>
                      <Input id="monthlyContribution" type="number" min={0} value={input.monthlyContribution || ""}
                        onChange={e => handleChange("monthlyContribution", e.target.value)}
                        className="pl-7 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500"
                        placeholder="500" />
                    </div>
                  </div>

                  {/* 복리 주기 */}
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm">복리 주기 (Compounding)</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["monthly", "quarterly", "annual"] as CompoundingFrequency[]).map(f => (
                        <button key={f} onClick={() => setFrequency(f)}
                          className={`text-xs py-1.5 rounded-md font-medium border transition-all ${
                            frequency === f
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : "bg-slate-700/60 text-slate-300 border-slate-600/50 hover:border-emerald-500/40"
                          }`}>
                          {f === "monthly" ? "월" : f === "quarterly" ? "분기" : "연"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 인플레이션 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300 text-sm">인플레이션 조정</Label>
                      <button onClick={() => setShowInflation(v => !v)}
                        className={`w-10 h-5 rounded-full transition-all relative ${showInflation ? "bg-emerald-500" : "bg-slate-600"}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${showInflation ? "left-5" : "left-0.5"}`} />
                      </button>
                    </div>
                    {showInflation && (
                      <div className="relative">
                        <Input type="number" min={0} max={20} step={0.1} value={inflationRate || ""}
                          onChange={e => setInflationRate(parseNumber(e.target.value))}
                          className="pr-8 bg-slate-700/50 border-slate-600 text-white focus:border-emerald-500"
                          placeholder="3" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Presets */}
                  <div className="pt-1 space-y-2">
                    <p className="text-slate-500 text-xs">Quick presets</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Conservative", rate: 4, years: 30 },
                        { label: "Balanced", rate: 7, years: 20 },
                        { label: "Aggressive", rate: 12, years: 15 },
                      ].map(preset => (
                        <button key={preset.label}
                          onClick={() => setInput(prev => ({ ...prev, annualRate: preset.rate, years: preset.years }))}
                          className="text-xs py-1.5 px-2 rounded-md bg-slate-700/60 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 border border-slate-600/50 hover:border-emerald-500/40 transition-all">
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button onClick={() => downloadCSV(result.yearlyBreakdown, currency)}
                      className="text-xs py-2 rounded-md bg-slate-700/60 text-slate-300 hover:bg-blue-500/20 hover:text-blue-400 border border-slate-600/50 hover:border-blue-500/40 transition-all">
                      CSV 다운로드
                    </button>
                    <button onClick={handleShare}
                      className="text-xs py-2 rounded-md bg-slate-700/60 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 border border-slate-600/50 hover:border-emerald-500/40 transition-all">
                      {copied ? "✓ 복사됨!" : "URL 공유"}
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Results Panel */}
              <div className="lg:col-span-3 space-y-4">
                <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-500/30 backdrop-blur-sm">
                  <CardContent className="pt-6 pb-6">
                    <div className="text-center space-y-1">
                      <p className="text-emerald-400 text-xs font-semibold tracking-widest uppercase">Total Future Value</p>
                      <p className="text-4xl md:text-5xl font-bold text-white tabular-nums">{fmt(result.totalValue)}</p>
                      <p className="text-slate-400 text-sm">After {input.years} year{input.years !== 1 ? "s" : ""} of growth</p>
                      {showInflation && result.realValue != null && (
                        <p className="text-amber-400 text-sm mt-1">
                          실질 가치 (인플레이션 {inflationRate}% 적용): {fmt(result.realValue)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-sm">
                    <CardContent className="pt-5 pb-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-400" />
                          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Total Principal</p>
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-white tabular-nums">{fmt(result.totalPrincipal)}</p>
                        <p className="text-slate-500 text-xs">{principalRatio}% of total</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-sm">
                    <CardContent className="pt-5 pb-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Interest Earned</p>
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-emerald-400 tabular-nums">{fmt(result.totalInterest)}</p>
                        <p className="text-slate-500 text-xs">{interestRatio}% of total</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-sm">
                  <CardContent className="pt-4 pb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Principal ({principalRatio}%)</span>
                        <span>Interest ({interestRatio}%)</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-700 overflow-hidden flex">
                        <div className="h-full bg-blue-500 transition-all duration-500 ease-out rounded-l-full" style={{ width: `${principalRatio}%` }} />
                        <div className="h-full bg-emerald-500 transition-all duration-500 ease-out rounded-r-full" style={{ width: `${interestRatio}%` }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Yearly Breakdown Table */}
                <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm">Year-by-Year Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-slate-800 border-b border-slate-700">
                          <tr>
                            <th className="text-left px-4 py-2 text-slate-400 font-medium text-xs">Year</th>
                            <th className="text-right px-4 py-2 text-slate-400 font-medium text-xs">Total Value</th>
                            <th className="text-right px-4 py-2 text-slate-400 font-medium text-xs hidden sm:table-cell">Principal</th>
                            <th className="text-right px-4 py-2 text-slate-400 font-medium text-xs">Interest</th>
                            {showInflation && <th className="text-right px-4 py-2 text-slate-400 font-medium text-xs hidden md:table-cell">실질가치</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {result.yearlyBreakdown.map((row, i) => (
                            <tr key={row.year}
                              className={`border-b border-slate-700/50 transition-colors hover:bg-slate-700/30 ${i % 2 === 0 ? "bg-slate-800/20" : ""}`}>
                              <td className="px-4 py-2 text-slate-300 font-medium">Y{row.year}</td>
                              <td className="px-4 py-2 text-right text-white font-semibold tabular-nums">{fmt(row.totalValue)}</td>
                              <td className="px-4 py-2 text-right text-blue-400 tabular-nums hidden sm:table-cell">{fmt(row.totalPrincipal)}</td>
                              <td className="px-4 py-2 text-right text-emerald-400 tabular-nums">{fmt(row.totalInterest)}</td>
                              {showInflation && <td className="px-4 py-2 text-right text-amber-400 tabular-nums hidden md:table-cell">{row.realValue != null ? fmt(row.realValue) : "-"}</td>}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Ad */}
            <AdUnit slot="5648421888" format="horizontal" className="w-full" />

            {/* Growth Chart */}
            <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Wealth Growth Over Time</CardTitle>
                <p className="text-slate-400 text-xs">Principal (blue) + Interest (green) stacked</p>
              </CardHeader>
              <CardContent>
                <GrowthChart data={result.yearlyBreakdown} currency={currency} />
              </CardContent>
            </Card>

            <AdUnit slot="5648421888" format="auto" className="w-full" />
          </>
        )}

        {/* ─── Tab: 목표 역산 ─── */}
        {tab === "goal" && (
          <>
            <GoalCalculator currency={currency} currencySymbol={currencySymbol} />
            <AdUnit slot="5648421888" format="horizontal" className="w-full" />
          </>
        )}

        {/* ─── Tab: 시나리오 비교 ─── */}
        {tab === "compare" && (
          <>
            <ScenarioComparison currency={currency} currencySymbol={currencySymbol} />
            <AdUnit slot="5648421888" format="horizontal" className="w-full" />
          </>
        )}

        {/* FAQ */}
        <div className="space-y-4">
          <h2 className="text-white text-xl font-bold text-center">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQ_EN.map((item, i) => (
              <Card key={i} className="bg-slate-800/60 border-slate-700/50 cursor-pointer"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-white font-medium text-sm">{item.q}</p>
                    <span className={`text-emerald-400 text-lg transition-transform flex-shrink-0 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                  </div>
                  {openFaq === i && <p className="text-slate-400 text-sm mt-3 leading-relaxed">{item.a}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <AdUnit slot="5648421888" format="horizontal" className="w-full" />

        {/* SEO Content */}
        <Card className="bg-slate-800/40 border-slate-700/30">
          <CardContent className="pt-6 pb-6 space-y-4 text-slate-400 text-sm leading-relaxed">
            <h2 className="text-white font-semibold text-base">How to Use This Compound Interest Calculator</h2>
            <p>
              Enter your <strong className="text-slate-300">initial investment</strong>, <strong className="text-slate-300">annual interest rate</strong>,{" "}
              <strong className="text-slate-300">investment period</strong>, and <strong className="text-slate-300">monthly contribution</strong> to instantly
              see your projected future wealth. Useful for planning retirement savings, college funds, index fund investing, and any long-term financial goal.
            </p>
            <p>
              The <strong className="text-slate-300">Goal Calculator</strong> tab works in reverse — enter your target amount and it tells you exactly
              how much to save each month. The <strong className="text-slate-300">Scenario Comparison</strong> tab lets you compare two different
              strategies side by side with a live chart.
            </p>
            <p className="text-xs text-slate-500">
              Also available in Korean: <Link href="/ko" className="text-emerald-500 hover:underline">복리 계산기 (한국어)</Link>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs">
          Global Tools Hub · Tool 01/10 · Compound Interest Calculator
        </p>
      </div>
    </main>
  )
}
