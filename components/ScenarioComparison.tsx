"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calculateCompoundInterest, formatCurrency, type CalculatorInput } from "@/lib/calculator"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface ScenarioComparisonProps {
  currency: string
  currencySymbol: string
}

const DEFAULTS: [CalculatorInput, CalculatorInput] = [
  { principal: 10000, annualRate: 5, years: 20, monthlyContribution: 300 },
  { principal: 10000, annualRate: 9, years: 20, monthlyContribution: 500 },
]

function parseNumber(v: string) {
  const n = parseFloat(v.replace(/,/g, ""))
  return isNaN(n) ? 0 : n
}

function ScenarioInput({
  label, color, input, symbol,
  onChange,
}: {
  label: string
  color: string
  input: CalculatorInput
  symbol: string
  onChange: (field: keyof CalculatorInput, value: string) => void
}) {
  return (
    <Card className={`bg-slate-800/60 border-${color}-500/30 backdrop-blur-sm`}>
      <CardHeader className="pb-3">
        <CardTitle className={`text-${color}-400 text-base`}>{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label className="text-slate-300 text-xs">초기 투자금</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">{symbol}</span>
            <Input type="number" min={0} value={input.principal || ""}
              onChange={e => onChange("principal", e.target.value)}
              className="pl-7 h-8 text-sm bg-slate-700/50 border-slate-600 text-white focus:border-emerald-500" />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-slate-300 text-xs">연 이율</Label>
          <div className="relative">
            <Input type="number" min={0} max={100} step={0.1} value={input.annualRate || ""}
              onChange={e => onChange("annualRate", e.target.value)}
              className="pr-8 h-8 text-sm bg-slate-700/50 border-slate-600 text-white focus:border-emerald-500" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-slate-300 text-xs">기간 (년)</Label>
          <div className="relative">
            <Input type="number" min={1} max={50} value={input.years || ""}
              onChange={e => onChange("years", e.target.value)}
              className="pr-10 h-8 text-sm bg-slate-700/50 border-slate-600 text-white focus:border-emerald-500" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">yrs</span>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-slate-300 text-xs">월 납입액</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">{symbol}</span>
            <Input type="number" min={0} value={input.monthlyContribution || ""}
              onChange={e => onChange("monthlyContribution", e.target.value)}
              className="pl-7 h-8 text-sm bg-slate-700/50 border-slate-600 text-white focus:border-emerald-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ScenarioComparison({ currency, currencySymbol }: ScenarioComparisonProps) {
  const [scenarios, setScenarios] = useState<[CalculatorInput, CalculatorInput]>(DEFAULTS)

  const results = useMemo(() => scenarios.map(s => calculateCompoundInterest(s)), [scenarios])

  const fmt = (v: number) => formatCurrency(v, currency)

  function updateScenario(idx: 0 | 1, field: keyof CalculatorInput, value: string) {
    setScenarios(prev => {
      const next: [CalculatorInput, CalculatorInput] = [{ ...prev[0] }, { ...prev[1] }]
      next[idx] = { ...next[idx], [field]: parseNumber(value) }
      return next
    })
  }

  // Merge chart data
  const maxYears = Math.max(scenarios[0].years, scenarios[1].years)
  const chartData = Array.from({ length: maxYears }, (_, i) => {
    const year = i + 1
    const a = results[0].yearlyBreakdown.find(r => r.year === year)
    const b = results[1].yearlyBreakdown.find(r => r.year === year)
    return { year, A: a?.totalValue ?? null, B: b?.totalValue ?? null }
  })

  const colors = ["#60a5fa", "#f59e0b"] // blue, amber

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScenarioInput label="시나리오 A" color="blue" input={scenarios[0]} symbol={currencySymbol}
          onChange={(f, v) => updateScenario(0, f, v)} />
        <ScenarioInput label="시나리오 B" color="amber" input={scenarios[1]} symbol={currencySymbol}
          onChange={(f, v) => updateScenario(1, f, v)} />
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((r, i) => (
          <Card key={i} className={`border-${i === 0 ? "blue" : "amber"}-500/30 bg-slate-800/60`}>
            <CardContent className="pt-5 pb-5">
              <p className={`text-${i === 0 ? "blue" : "amber"}-400 text-xs font-semibold uppercase tracking-widest mb-1`}>
                시나리오 {i === 0 ? "A" : "B"} 결과
              </p>
              <p className="text-2xl font-bold text-white tabular-nums mb-3">{fmt(r.totalValue)}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">총 원금</span>
                  <span className="text-blue-400">{fmt(r.totalPrincipal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">이자 수익</span>
                  <span className="text-emerald-400">{fmt(r.totalInterest)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Difference */}
      <Card className="bg-slate-800/60 border-slate-700/50">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">B가 A보다</span>
            <span className={`text-lg font-bold ${results[1].totalValue >= results[0].totalValue ? "text-emerald-400" : "text-red-400"}`}>
              {results[1].totalValue >= results[0].totalValue ? "+" : ""}{fmt(results[1].totalValue - results[0].totalValue)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="bg-slate-800/60 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm">시나리오 비교 차트</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }}
                tickLine={false} tickFormatter={v => `Y${v}`} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={60}
                tickFormatter={v => {
                  const s = currency === "KRW" ? "₩" : currency === "EUR" ? "€" : "$"
                  if (v >= 1_000_000) return `${s}${(v / 1_000_000).toFixed(1)}M`
                  if (v >= 1_000) return `${s}${(v / 1_000).toFixed(0)}K`
                  return `${s}${v}`
                }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px" }}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(v, name) => [typeof v === "number" ? fmt(v) : String(v), name === "A" ? "시나리오 A" : "시나리오 B"]}
                labelFormatter={v => `Year ${v}`}
              />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#94a3b8", paddingTop: "12px" }}
                formatter={v => v === "A" ? "시나리오 A" : "시나리오 B"} />
              {colors.map((color, i) => (
                <Area key={i} type="monotone" dataKey={i === 0 ? "A" : "B"}
                  stroke={color} strokeWidth={2} fill={color} fillOpacity={0.1} connectNulls />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
