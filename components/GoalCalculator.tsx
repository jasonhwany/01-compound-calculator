"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calculateRequiredMonthly, formatCurrency, type CompoundingFrequency } from "@/lib/calculator"

interface GoalCalculatorProps {
  currency: string
  currencySymbol: string
}

function parseNumber(v: string) {
  const n = parseFloat(v.replace(/,/g, ""))
  return isNaN(n) ? 0 : n
}

export default function GoalCalculator({ currency, currencySymbol }: GoalCalculatorProps) {
  const [goal, setGoal] = useState(1000000)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(20)
  const [principal, setPrincipal] = useState(10000)
  const [frequency, setFrequency] = useState<CompoundingFrequency>("monthly")

  const required = useMemo(
    () => calculateRequiredMonthly(goal, rate, years, principal, frequency),
    [goal, rate, years, principal, frequency]
  )

  const fmt = (v: number) => formatCurrency(v, currency)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-lg">목표 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">목표 금액 (Goal Amount)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{currencySymbol}</span>
                <Input
                  type="number" min={0}
                  value={goal || ""}
                  onChange={e => setGoal(parseNumber(e.target.value))}
                  className="pl-7 bg-slate-700/50 border-slate-600 text-white focus:border-emerald-500"
                  placeholder="1,000,000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">초기 투자금 (Initial Investment)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{currencySymbol}</span>
                <Input
                  type="number" min={0}
                  value={principal || ""}
                  onChange={e => setPrincipal(parseNumber(e.target.value))}
                  className="pl-7 bg-slate-700/50 border-slate-600 text-white focus:border-emerald-500"
                  placeholder="10,000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">연 이율 (Annual Rate)</Label>
              <div className="relative">
                <Input
                  type="number" min={0} max={100} step={0.1}
                  value={rate || ""}
                  onChange={e => setRate(parseNumber(e.target.value))}
                  className="pr-8 bg-slate-700/50 border-slate-600 text-white focus:border-emerald-500"
                  placeholder="7"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">투자 기간 (Years)</Label>
              <div className="relative">
                <Input
                  type="number" min={1} max={50}
                  value={years || ""}
                  onChange={e => setYears(parseNumber(e.target.value))}
                  className="pr-14 bg-slate-700/50 border-slate-600 text-white focus:border-emerald-500"
                  placeholder="20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">yrs</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">복리 주기</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["monthly", "quarterly", "annual"] as CompoundingFrequency[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={`py-1.5 rounded-md text-xs font-medium border transition-all ${
                      frequency === f
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-slate-700/60 text-slate-300 border-slate-600/50 hover:border-emerald-500/40"
                    }`}
                  >
                    {f === "monthly" ? "월" : f === "quarterly" ? "분기" : "연"}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-500/30">
            <CardContent className="pt-8 pb-8 text-center space-y-2">
              <p className="text-emerald-400 text-xs font-semibold tracking-widest uppercase">
                필요한 월 납입액
              </p>
              <p className="text-4xl md:text-5xl font-bold text-white tabular-nums">
                {fmt(required)}
              </p>
              <p className="text-slate-400 text-sm">매월 납입 시 {years}년 후 {fmt(goal)} 달성</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-slate-700/50">
            <CardContent className="pt-5 pb-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">목표 금액</span>
                <span className="text-white font-semibold">{fmt(goal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">초기 투자금</span>
                <span className="text-blue-400">{fmt(principal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">월 납입 × {years * 12}개월</span>
                <span className="text-blue-400">{fmt(required * years * 12)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-700 pt-3">
                <span className="text-slate-400">총 납입 원금</span>
                <span className="text-blue-400">{fmt(principal + required * years * 12)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">이자 수익</span>
                <span className="text-emerald-400">{fmt(goal - principal - required * years * 12)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick goal presets */}
          <Card className="bg-slate-800/60 border-slate-700/50">
            <CardContent className="pt-4 pb-4">
              <p className="text-slate-500 text-xs mb-3">목표 금액 프리셋</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "1억", value: 100000000 },
                  { label: "5억", value: 500000000 },
                  { label: "10억", value: 1000000000 },
                  { label: "$100K", value: 100000 },
                  { label: "$500K", value: 500000 },
                  { label: "$1M", value: 1000000 },
                ].map(p => (
                  <button
                    key={p.label}
                    onClick={() => setGoal(p.value)}
                    className="text-xs py-1.5 px-2 rounded-md bg-slate-700/60 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 border border-slate-600/50 hover:border-emerald-500/40 transition-all"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
