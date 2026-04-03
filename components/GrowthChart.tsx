"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { YearlySnapshot } from "@/lib/calculator"
import { formatCurrency } from "@/lib/calculator"

interface GrowthChartProps {
  data: YearlySnapshot[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl text-xs space-y-1">
      <p className="text-slate-300 font-semibold mb-1">Year {label}</p>
      <p className="text-blue-400">
        Principal: {formatCurrency(payload[0]?.value ?? 0)}
      </p>
      <p className="text-emerald-400">
        Interest: {formatCurrency(payload[1]?.value ?? 0)}
      </p>
      <p className="text-white font-bold pt-1 border-t border-slate-700">
        Total: {formatCurrency((payload[0]?.value ?? 0) + (payload[1]?.value ?? 0))}
      </p>
    </div>
  )
}

export default function GrowthChart({ data }: GrowthChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={{ stroke: "#334155" }}
          tickLine={false}
          tickFormatter={(v) => `Y${v}`}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => {
            if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
            if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
            return `$${v}`
          }}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "12px", color: "#94a3b8", paddingTop: "12px" }}
          formatter={(value) => value === "totalPrincipal" ? "Principal" : "Interest"}
        />
        <Area
          type="monotone"
          dataKey="totalPrincipal"
          stackId="1"
          stroke="#60a5fa"
          strokeWidth={2}
          fill="url(#colorPrincipal)"
        />
        <Area
          type="monotone"
          dataKey="totalInterest"
          stackId="1"
          stroke="#34d399"
          strokeWidth={2}
          fill="url(#colorInterest)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
