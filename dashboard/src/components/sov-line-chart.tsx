"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import type { SovMeasurement } from "@/lib/types"

type Props = {
  data: SovMeasurement[]
  height?: number
  target?: number
}

export function SovLineChart({ data, height = 260, target }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[260px] text-muted-foreground text-sm border rounded-lg">
        측정 데이터 없음
      </div>
    )
  }

  const chartData = data.map((d) => ({
    date: d.measured_date.slice(5),
    SOV: Number(d.sov_percent),
    cited: d.cited_us,
    success: d.queries_success,
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, "dataMax + 5"]} />
        <Tooltip
          formatter={(value) => {
            const n = typeof value === "number" ? value : Number(value)
            return Number.isFinite(n) ? `${n.toFixed(2)}%` : String(value)
          }}
          labelStyle={{ color: "#000" }}
          contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", fontSize: 12 }}
        />
        {target ? (
          <ReferenceLine y={target} stroke="currentColor" strokeDasharray="4 4" strokeOpacity={0.4} />
        ) : null}
        <Line
          type="monotone"
          dataKey="SOV"
          stroke="currentColor"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
