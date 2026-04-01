export interface CalculatorInput {
  principal: number
  annualRate: number
  years: number
  monthlyContribution: number
}

export interface YearlySnapshot {
  year: number
  totalValue: number
  totalPrincipal: number
  totalInterest: number
}

export interface CalculatorResult {
  totalValue: number
  totalPrincipal: number
  totalInterest: number
  yearlyBreakdown: YearlySnapshot[]
}

export function calculateCompoundInterest(input: CalculatorInput): CalculatorResult {
  const { principal, annualRate, years, monthlyContribution } = input

  const monthlyRate = annualRate / 100 / 12
  const totalMonths = years * 12

  const yearlyBreakdown: YearlySnapshot[] = []

  let totalValue = 0
  let totalPrincipal = 0

  for (let month = 1; month <= totalMonths; month++) {
    if (month === 1) {
      totalValue = (principal + monthlyContribution) * (1 + monthlyRate)
      totalPrincipal = principal + monthlyContribution
    } else {
      totalValue = (totalValue + monthlyContribution) * (1 + monthlyRate)
      totalPrincipal += monthlyContribution
    }

    if (month % 12 === 0) {
      yearlyBreakdown.push({
        year: month / 12,
        totalValue: Math.round(totalValue * 100) / 100,
        totalPrincipal: Math.round(totalPrincipal * 100) / 100,
        totalInterest: Math.round((totalValue - totalPrincipal) * 100) / 100,
      })
    }
  }

  const finalValue = Math.round(totalValue * 100) / 100
  const finalPrincipal = Math.round(totalPrincipal * 100) / 100
  const finalInterest = Math.round((finalValue - finalPrincipal) * 100) / 100

  return {
    totalValue: finalValue,
    totalPrincipal: finalPrincipal,
    totalInterest: finalInterest,
    yearlyBreakdown,
  }
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
