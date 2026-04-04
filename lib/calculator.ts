export type CompoundingFrequency = 'monthly' | 'quarterly' | 'annual'

export interface CalculatorInput {
  principal: number
  annualRate: number
  years: number
  monthlyContribution: number
  frequency?: CompoundingFrequency
  inflationRate?: number
}

export interface YearlySnapshot {
  year: number
  totalValue: number
  totalPrincipal: number
  totalInterest: number
  realValue?: number
}

export interface CalculatorResult {
  totalValue: number
  totalPrincipal: number
  totalInterest: number
  realValue?: number
  yearlyBreakdown: YearlySnapshot[]
}

function getPeriodsPerYear(frequency: CompoundingFrequency): number {
  if (frequency === 'quarterly') return 4
  if (frequency === 'annual') return 1
  return 12
}

export function calculateCompoundInterest(input: CalculatorInput): CalculatorResult {
  const { principal, annualRate, years, monthlyContribution, frequency = 'monthly', inflationRate = 0 } = input

  const n = getPeriodsPerYear(frequency)
  const ratePerPeriod = annualRate / 100 / n
  const totalPeriods = years * n
  const contributionPerPeriod = monthlyContribution * (12 / n)

  const yearlyBreakdown: YearlySnapshot[] = []
  let totalValue = 0
  let totalPrincipal = 0

  for (let period = 1; period <= totalPeriods; period++) {
    if (period === 1) {
      totalValue = (principal + contributionPerPeriod) * (1 + ratePerPeriod)
      totalPrincipal = principal + contributionPerPeriod
    } else {
      totalValue = (totalValue + contributionPerPeriod) * (1 + ratePerPeriod)
      totalPrincipal += contributionPerPeriod
    }

    if (period % n === 0) {
      const year = period / n
      const realValue = inflationRate > 0
        ? Math.round(totalValue / Math.pow(1 + inflationRate / 100, year) * 100) / 100
        : undefined
      yearlyBreakdown.push({
        year,
        totalValue: Math.round(totalValue * 100) / 100,
        totalPrincipal: Math.round(totalPrincipal * 100) / 100,
        totalInterest: Math.round((totalValue - totalPrincipal) * 100) / 100,
        realValue,
      })
    }
  }

  const finalValue = Math.round(totalValue * 100) / 100
  const finalPrincipal = Math.round(totalPrincipal * 100) / 100
  const finalInterest = Math.round((finalValue - finalPrincipal) * 100) / 100
  const realValue = inflationRate > 0
    ? Math.round(finalValue / Math.pow(1 + inflationRate / 100, years) * 100) / 100
    : undefined

  return { totalValue: finalValue, totalPrincipal: finalPrincipal, totalInterest: finalInterest, realValue, yearlyBreakdown }
}

// 목표 역산: 목표 금액 달성에 필요한 월 납입액
export function calculateRequiredMonthly(
  goalAmount: number,
  annualRate: number,
  years: number,
  principal: number,
  frequency: CompoundingFrequency = 'monthly'
): number {
  const n = getPeriodsPerYear(frequency)
  const r = annualRate / 100 / n
  const periods = years * n
  const fvPrincipal = principal * Math.pow(1 + r, periods)
  const remaining = goalAmount - fvPrincipal
  if (remaining <= 0) return 0
  if (r === 0) return remaining / periods * (12 / n)
  const fvFactor = (Math.pow(1 + r, periods) - 1) / r
  const perPeriod = remaining / fvFactor
  return Math.round(perPeriod * (12 / n) * 100) / 100
}

export function downloadCSV(breakdown: YearlySnapshot[], currency: string) {
  const header = ['Year', 'Total Value', 'Principal', 'Interest Earned', 'Real Value'].join(',')
  const rows = breakdown.map(r =>
    [r.year, r.totalValue, r.totalPrincipal, r.totalInterest, r.realValue ?? ''].join(',')
  )
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `compound-interest-${currency}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}
