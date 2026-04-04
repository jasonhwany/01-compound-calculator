"use client"

import Script from "next/script"
import { useState, useMemo } from "react"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Compound Interest Calculator",
  url: "https://01-compound-calculator.vercel.app",
  description:
    "Free online compound interest calculator. Calculate how your investments grow over time with monthly contributions and annual interest rate.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Compound interest calculation",
    "Monthly contribution support",
    "Year-by-year breakdown",
    "Interactive growth chart",
  ],
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calculateCompoundInterest, formatCurrency, type CalculatorInput } from "@/lib/calculator"
import GrowthChart from "@/components/GrowthChart"
import AdUnit from "@/components/AdUnit"

const DEFAULT_INPUT: CalculatorInput = {
  principal: 10000,
  annualRate: 7,
  years: 20,
  monthlyContribution: 500,
}

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD" },
  { code: "KRW", symbol: "₩", label: "KRW" },
  { code: "EUR", symbol: "€", label: "EUR" },
] as const

type CurrencyCode = "USD" | "KRW" | "EUR"

function parseNumber(value: string): number {
  const parsed = parseFloat(value.replace(/,/g, ""))
  return isNaN(parsed) ? 0 : parsed
}

export default function CompoundCalculatorPage() {
  const [input, setInput] = useState<CalculatorInput>(DEFAULT_INPUT)
  const [currency, setCurrency] = useState<CurrencyCode>("USD")

  const result = useMemo(() => calculateCompoundInterest(input), [input])
  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol ?? "$"
  const fmt = (v: number) => formatCurrency(v, currency)

  const principalRatio = result.totalValue > 0
    ? Math.round((result.totalPrincipal / result.totalValue) * 100)
    : 0
  const interestRatio = 100 - principalRatio

  function handleChange(field: keyof CalculatorInput, value: string) {
    setInput((prev) => ({ ...prev, [field]: parseNumber(value) }))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8 md:py-12">
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase">
            Global Tools Hub
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Compound Interest Calculator
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            Watch your money grow with the power of compounding.
            Enter your details below to see the magic happen.
          </p>
          {/* Currency Selector */}
          <div className="flex justify-center gap-2 pt-2">
            {CURRENCIES.map(c => (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  currency === c.code
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-slate-800 text-slate-400 border-slate-600 hover:border-emerald-500/50 hover:text-slate-200"
                }`}
              >
                {c.symbol} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ad — 헤더 하단 */}
        <AdUnit slot="5648421888" format="horizontal" className="w-full" />

        {/* Main Grid */}
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
                <Label htmlFor="principal" className="text-slate-300 text-sm">
                  Initial Investment
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{currencySymbol}</span>
                  <Input
                    id="principal"
                    type="number"
                    min={0}
                    value={input.principal || ""}
                    onChange={(e) => handleChange("principal", e.target.value)}
                    className="pl-7 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    placeholder="10,000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualRate" className="text-slate-300 text-sm">
                  Annual Interest Rate
                </Label>
                <div className="relative">
                  <Input
                    id="annualRate"
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={input.annualRate || ""}
                    onChange={(e) => handleChange("annualRate", e.target.value)}
                    className="pr-8 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    placeholder="7"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="years" className="text-slate-300 text-sm">
                  Investment Period
                </Label>
                <div className="relative">
                  <Input
                    id="years"
                    type="number"
                    min={1}
                    max={50}
                    value={input.years || ""}
                    onChange={(e) => handleChange("years", e.target.value)}
                    className="pr-14 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    placeholder="20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">yrs</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyContribution" className="text-slate-300 text-sm">
                  Monthly Contribution
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{currencySymbol}</span>
                  <Input
                    id="monthlyContribution"
                    type="number"
                    min={0}
                    value={input.monthlyContribution || ""}
                    onChange={(e) => handleChange("monthlyContribution", e.target.value)}
                    className="pl-7 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    placeholder="500"
                  />
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="pt-1 space-y-2">
                <p className="text-slate-500 text-xs">Quick presets</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Conservative", rate: 4, years: 30 },
                    { label: "Balanced", rate: 7, years: 20 },
                    { label: "Aggressive", rate: 12, years: 15 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() =>
                        setInput((prev) => ({
                          ...prev,
                          annualRate: preset.rate,
                          years: preset.years,
                        }))
                      }
                      className="text-xs py-1.5 px-2 rounded-md bg-slate-700/60 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 border border-slate-600/50 hover:border-emerald-500/40 transition-all"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="lg:col-span-3 space-y-4">

            {/* Total Value — Hero Card */}
            <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-500/30 backdrop-blur-sm">
              <CardContent className="pt-6 pb-6">
                <div className="text-center space-y-1">
                  <p className="text-emerald-400 text-xs font-semibold tracking-widest uppercase">
                    Total Future Value
                  </p>
                  <p className="text-4xl md:text-5xl font-bold text-white tabular-nums">
                    {fmt(result.totalValue)}
                  </p>
                  <p className="text-slate-400 text-sm">
                    After {input.years} year{input.years !== 1 ? "s" : ""} of growth
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Principal vs Interest Split */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="pt-5 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">
                        Total Principal
                      </p>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-white tabular-nums">
                      {fmt(result.totalPrincipal)}
                    </p>
                    <p className="text-slate-500 text-xs">{principalRatio}% of total</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="pt-5 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">
                        Interest Earned
                      </p>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-emerald-400 tabular-nums">
                      {fmt(result.totalInterest)}
                    </p>
                    <p className="text-slate-500 text-xs">{interestRatio}% of total</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Bar */}
            <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="pt-4 pb-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Principal ({principalRatio}%)</span>
                    <span>Interest ({interestRatio}%)</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-700 overflow-hidden flex">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500 ease-out rounded-l-full"
                      style={{ width: `${principalRatio}%` }}
                    />
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500 ease-out rounded-r-full"
                      style={{ width: `${interestRatio}%` }}
                    />
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
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearlyBreakdown.map((row, i) => (
                        <tr
                          key={row.year}
                          className={`border-b border-slate-700/50 transition-colors hover:bg-slate-700/30 ${
                            i % 2 === 0 ? "bg-slate-800/20" : ""
                          }`}
                        >
                          <td className="px-4 py-2 text-slate-300 font-medium">Y{row.year}</td>
                          <td className="px-4 py-2 text-right text-white font-semibold tabular-nums">
                            {fmt(row.totalValue)}
                          </td>
                          <td className="px-4 py-2 text-right text-blue-400 tabular-nums hidden sm:table-cell">
                            {fmt(row.totalPrincipal)}
                          </td>
                          <td className="px-4 py-2 text-right text-emerald-400 tabular-nums">
                            {fmt(row.totalInterest)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ad — 테이블/차트 사이 */}
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

        {/* Ad — 차트 하단 */}
        <AdUnit slot="5648421888" format="auto" className="w-full" />

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs">
          Global Tools Hub · Tool 01/10 · Compound Interest Calculator
        </p>
      </div>
    </main>
  )
}
