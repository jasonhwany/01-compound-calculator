"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  calculateCompoundInterest, calculateRequiredMonthly, formatCurrency, downloadCSV,
  type CalculatorInput, type CompoundingFrequency
} from "@/lib/calculator"
import GrowthChart from "@/components/GrowthChart"
import AdUnit from "@/components/AdUnit"
import GoalCalculator from "@/components/GoalCalculator"
import ScenarioComparison from "@/components/ScenarioComparison"

const TABS = [
  { id: "calculator", label: "복리 계산기" },
  { id: "goal", label: "목표 금액 역산" },
  { id: "compare", label: "시나리오 비교" },
] as const
type TabId = typeof TABS[number]["id"]

const DEFAULT_INPUT: CalculatorInput = { principal: 10000000, annualRate: 5, years: 20, monthlyContribution: 500000 }

function parseNumber(v: string) {
  const n = parseFloat(v.replace(/,/g, ""))
  return isNaN(n) ? 0 : n
}

const FAQ = [
  {
    q: "복리 계산기란 무엇인가요?",
    a: "복리 계산기는 원금과 이자에 다시 이자가 붙는 '복리 효과'를 계산하는 도구입니다. 매월 일정 금액을 추가로 납입하면서 장기 투자 시 최종 자산이 얼마나 될지 예측할 수 있습니다.",
  },
  {
    q: "복리와 단리의 차이는 무엇인가요?",
    a: "단리는 원금에만 이자가 붙지만, 복리는 원금 + 이미 붙은 이자 모두에 이자가 붙습니다. 장기 투자일수록 복리 효과가 극적으로 커집니다. 예를 들어 연 7% 복리로 30년 투자 시 원금의 약 7.6배가 됩니다.",
  },
  {
    q: "월 복리와 연 복리 중 어느 것이 더 유리한가요?",
    a: "월 복리가 연 복리보다 유리합니다. 같은 연이율이라도 복리 횟수가 많을수록 최종 수익이 높아집니다. 대부분의 적금·펀드는 월 복리를 적용합니다.",
  },
  {
    q: "노후 준비를 위한 적정 월 납입액은 얼마인가요?",
    a: "'목표 금액 역산' 탭에서 목표 금액과 기간을 입력하면 필요한 월 납입액을 자동으로 계산합니다. 예를 들어 20년 후 5억을 목표로 연 5% 수익률이라면 월 약 120만원이 필요합니다.",
  },
  {
    q: "인플레이션을 고려해야 하는 이유는?",
    a: "20년 후 1억원의 실질 구매력은 지금보다 훨씬 낮습니다. 인플레이션 3% 가정 시 20년 후 1억원의 현재 가치는 약 5,537만원입니다. '인플레이션 조정' 토글을 켜면 실질 가치를 함께 확인할 수 있습니다.",
  },
]

export default function KoreanPage() {
  const [tab, setTab] = useState<TabId>("calculator")
  const [input, setInput] = useState<CalculatorInput>(DEFAULT_INPUT)
  const [frequency, setFrequency] = useState<CompoundingFrequency>("monthly")
  const [inflationRate, setInflationRate] = useState(0)
  const [showInflation, setShowInflation] = useState(false)
  const [copied, setCopied] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const result = useMemo(() => calculateCompoundInterest({ ...input, frequency, inflationRate: showInflation ? inflationRate : 0 }), [input, frequency, inflationRate, showInflation])
  const fmt = (v: number) => formatCurrency(v, "KRW")

  const principalRatio = result.totalValue > 0 ? Math.round((result.totalPrincipal / result.totalValue) * 100) : 0
  const interestRatio = 100 - principalRatio

  function handleChange(field: keyof CalculatorInput, value: string) {
    setInput(prev => ({ ...prev, [field]: parseNumber(value) }))
  }

  const handleShare = useCallback(() => {
    const params = new URLSearchParams({
      p: String(input.principal), r: String(input.annualRate),
      y: String(input.years), m: String(input.monthlyContribution), f: frequency,
    })
    navigator.clipboard.writeText(`${window.location.origin}/ko?${params.toString()}`).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [input, frequency])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center gap-3 text-xs">
            <Link href="/" className="text-slate-500 hover:text-slate-300 transition-colors">🌐 English</Link>
            <span className="text-emerald-400 font-semibold">🇰🇷 한국어</span>
          </div>
          <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase">MoneyStom7</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            복리 계산기
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            월 적립식 복리 계산기 — 초기 투자금과 매월 납입액으로 미래 자산을 예측하세요.
            목표 금액 역산, 시나리오 비교, 인플레이션 조정까지 한 번에.
          </p>
        </div>

        <AdUnit slot="5648421888" format="horizontal" className="w-full" />

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/50">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                tab === t.id ? "bg-emerald-500 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ─── 계산기 탭 ─── */}
        {tab === "calculator" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <Card className="lg:col-span-2 bg-slate-800/60 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-lg">입력값</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">

                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm">초기 투자금 (원금)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₩</span>
                      <Input type="number" min={0} value={input.principal || ""}
                        onChange={e => handleChange("principal", e.target.value)}
                        className="pl-7 bg-slate-700/50 border-slate-600 text-white focus:border-emerald-500" placeholder="10,000,000" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm">연 수익률 (이율)</Label>
                    <div className="relative">
                      <Input type="number" min={0} max={100} step={0.1} value={input.annualRate || ""}
                        onChange={e => handleChange("annualRate", e.target.value)}
                        className="pr-8 bg-slate-700/50 border-slate-600 text-white focus:border-emerald-500" placeholder="5" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm">투자 기간</Label>
                    <div className="relative">
                      <Input type="number" min={1} max={50} value={input.years || ""}
                        onChange={e => handleChange("years", e.target.value)}
                        className="pr-10 bg-slate-700/50 border-slate-600 text-white focus:border-emerald-500" placeholder="20" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">년</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm">월 납입액 (적립액)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₩</span>
                      <Input type="number" min={0} value={input.monthlyContribution || ""}
                        onChange={e => handleChange("monthlyContribution", e.target.value)}
                        className="pl-7 bg-slate-700/50 border-slate-600 text-white focus:border-emerald-500" placeholder="500,000" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm">복리 주기</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["monthly", "quarterly", "annual"] as CompoundingFrequency[]).map(f => (
                        <button key={f} onClick={() => setFrequency(f)}
                          className={`text-xs py-1.5 rounded-md font-medium border transition-all ${
                            frequency === f ? "bg-emerald-500 text-white border-emerald-500"
                              : "bg-slate-700/60 text-slate-300 border-slate-600/50 hover:border-emerald-500/40"
                          }`}>
                          {f === "monthly" ? "월 복리" : f === "quarterly" ? "분기 복리" : "연 복리"}
                        </button>
                      ))}
                    </div>
                  </div>

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
                          className="pr-8 bg-slate-700/50 border-slate-600 text-white focus:border-emerald-500" placeholder="3" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-1 space-y-2">
                    <p className="text-slate-500 text-xs">빠른 설정 프리셋</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "안정형 4%", rate: 4, years: 30 },
                        { label: "균형형 7%", rate: 7, years: 20 },
                        { label: "공격형 12%", rate: 12, years: 15 },
                      ].map(p => (
                        <button key={p.label}
                          onClick={() => setInput(prev => ({ ...prev, annualRate: p.rate, years: p.years }))}
                          className="text-xs py-1.5 px-2 rounded-md bg-slate-700/60 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 border border-slate-600/50 hover:border-emerald-500/40 transition-all">
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button onClick={() => downloadCSV(result.yearlyBreakdown, "KRW")}
                      className="text-xs py-2 rounded-md bg-slate-700/60 text-slate-300 hover:bg-blue-500/20 hover:text-blue-400 border border-slate-600/50 transition-all">
                      CSV 다운로드
                    </button>
                    <button onClick={handleShare}
                      className="text-xs py-2 rounded-md bg-slate-700/60 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 border border-slate-600/50 transition-all">
                      {copied ? "✓ 복사됨!" : "URL 공유"}
                    </button>
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-3 space-y-4">
                <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-500/30">
                  <CardContent className="pt-6 pb-6 text-center space-y-1">
                    <p className="text-emerald-400 text-xs font-semibold tracking-widest uppercase">최종 자산 (미래 가치)</p>
                    <p className="text-4xl md:text-5xl font-bold text-white tabular-nums">{fmt(result.totalValue)}</p>
                    <p className="text-slate-400 text-sm">{input.years}년 후 예상 자산</p>
                    {showInflation && result.realValue != null && (
                      <p className="text-amber-400 text-sm mt-1">실질 가치 (인플레이션 {inflationRate}% 적용): {fmt(result.realValue)}</p>
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-slate-800/60 border-slate-700/50">
                    <CardContent className="pt-5 pb-5 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        <p className="text-slate-400 text-xs uppercase tracking-wide">총 납입 원금</p>
                      </div>
                      <p className="text-xl font-bold text-white tabular-nums">{fmt(result.totalPrincipal)}</p>
                      <p className="text-slate-500 text-xs">전체의 {principalRatio}%</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/60 border-slate-700/50">
                    <CardContent className="pt-5 pb-5 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <p className="text-slate-400 text-xs uppercase tracking-wide">총 이자 수익</p>
                      </div>
                      <p className="text-xl font-bold text-emerald-400 tabular-nums">{fmt(result.totalInterest)}</p>
                      <p className="text-slate-500 text-xs">전체의 {interestRatio}%</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-slate-800/60 border-slate-700/50">
                  <CardContent className="pt-4 pb-4 space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>원금 ({principalRatio}%)</span>
                      <span>이자 ({interestRatio}%)</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-700 overflow-hidden flex">
                      <div className="h-full bg-blue-500 transition-all duration-500 rounded-l-full" style={{ width: `${principalRatio}%` }} />
                      <div className="h-full bg-emerald-500 transition-all duration-500 rounded-r-full" style={{ width: `${interestRatio}%` }} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/60 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm">연도별 자산 현황</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-slate-800 border-b border-slate-700">
                          <tr>
                            <th className="text-left px-4 py-2 text-slate-400 text-xs">연도</th>
                            <th className="text-right px-4 py-2 text-slate-400 text-xs">자산 합계</th>
                            <th className="text-right px-4 py-2 text-slate-400 text-xs hidden sm:table-cell">원금</th>
                            <th className="text-right px-4 py-2 text-slate-400 text-xs">이자</th>
                            {showInflation && <th className="text-right px-4 py-2 text-slate-400 text-xs hidden md:table-cell">실질가치</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {result.yearlyBreakdown.map((row, i) => (
                            <tr key={row.year}
                              className={`border-b border-slate-700/50 hover:bg-slate-700/30 ${i % 2 === 0 ? "bg-slate-800/20" : ""}`}>
                              <td className="px-4 py-2 text-slate-300 font-medium">{row.year}년차</td>
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

            <AdUnit slot="5648421888" format="horizontal" className="w-full" />

            <Card className="bg-slate-800/60 border-slate-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">자산 성장 그래프</CardTitle>
                <p className="text-slate-400 text-xs">파란색: 원금 / 초록색: 이자 (누적)</p>
              </CardHeader>
              <CardContent>
                <GrowthChart data={result.yearlyBreakdown} currency="KRW" />
              </CardContent>
            </Card>

            <AdUnit slot="5648421888" format="auto" className="w-full" />
          </>
        )}

        {tab === "goal" && (
          <>
            <GoalCalculator currency="KRW" currencySymbol="₩" />
            <AdUnit slot="5648421888" format="horizontal" className="w-full" />
          </>
        )}

        {tab === "compare" && (
          <>
            <ScenarioComparison currency="KRW" currencySymbol="₩" />
            <AdUnit slot="5648421888" format="horizontal" className="w-full" />
          </>
        )}

        {/* FAQ 섹션 */}
        <div className="space-y-4">
          <h2 className="text-white text-xl font-bold text-center">복리 계산기 자주 묻는 질문</h2>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <Card key={i} className="bg-slate-800/60 border-slate-700/50 cursor-pointer"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-white font-medium text-sm">{item.q}</p>
                    <span className={`text-emerald-400 text-lg transition-transform flex-shrink-0 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                  </div>
                  {openFaq === i && (
                    <p className="text-slate-400 text-sm mt-3 leading-relaxed">{item.a}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <AdUnit slot="5648421888" format="horizontal" className="w-full" />

        {/* SEO 텍스트 */}
        <Card className="bg-slate-800/40 border-slate-700/30">
          <CardContent className="pt-6 pb-6 space-y-4 text-slate-400 text-sm leading-relaxed">
            <h2 className="text-white font-semibold text-base">복리 계산기 사용법</h2>
            <p>
              이 복리 계산기는 <strong className="text-slate-300">초기 투자금</strong>, <strong className="text-slate-300">연 수익률</strong>,
              <strong className="text-slate-300">투자 기간</strong>, <strong className="text-slate-300">월 납입액</strong> 4가지만 입력하면
              미래 자산을 즉시 계산합니다. 주식, 펀드, 적금, ETF 투자 계획에 모두 활용할 수 있습니다.
            </p>
            <p>
              <strong className="text-slate-300">목표 금액 역산 기능</strong>을 사용하면 은퇴 후 필요한 자금, 자녀 교육비,
              내 집 마련 목표 등 특정 금액을 달성하기 위해 지금 당장 얼마씩 저축해야 하는지 계산할 수 있습니다.
            </p>
            <p>
              <strong className="text-slate-300">시나리오 비교 기능</strong>으로 공격적 투자와 안정적 투자를 나란히 비교하거나,
              월 납입액을 늘렸을 때의 차이를 시각적으로 확인할 수 있습니다.
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-slate-600 text-xs">
          MoneyStom7 · 복리 계산기 · <Link href="/" className="hover:text-slate-400">English Version</Link>
        </p>
      </div>
    </main>
  )
}
