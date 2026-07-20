import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
} from "recharts";

const data = [
  { week: "W1", velocity: 42, forecast: 40 },
  { week: "W2", velocity: 55, forecast: 48 },
  { week: "W3", velocity: 49, forecast: 54 },
  { week: "W4", velocity: 63, forecast: 60 },
  { week: "W5", velocity: 71, forecast: 66 },
  { week: "W6", velocity: 68, forecast: 71 },
  { week: "W7", velocity: 82, forecast: 76 },
  { week: "W8", velocity: 91, forecast: 82 },
  { week: "W9", velocity: 88, forecast: 87 },
  { week: "W10", velocity: 97, forecast: 92 },
];

export function VelocityChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-elevated">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Execution intelligence
          </div>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">
            Goal Execution Velocity
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Momentum score across all active goals · last 10 weeks
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Actual velocity</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-muted-foreground">AI forecast</span>
          </div>
        </div>
      </div>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.78 0.16 155)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="oklch(0.78 0.16 155)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="oklch(0.30 0.02 260 / 40%)" strokeDasharray="3 6" vertical={false} />
            <XAxis
              dataKey="week"
              stroke="oklch(0.68 0.02 260)"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="oklch(0.68 0.02 260)"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ stroke: "oklch(0.78 0.16 155)", strokeWidth: 1, strokeDasharray: "3 3" }}
              contentStyle={{
                backgroundColor: "oklch(0.18 0.014 260)",
                border: "1px solid oklch(0.30 0.02 260)",
                borderRadius: 10,
                fontSize: 12,
                color: "oklch(0.97 0.005 260)",
              }}
              labelStyle={{ color: "oklch(0.68 0.02 260)" }}
            />
            <Area
              type="monotone"
              dataKey="velocity"
              stroke="oklch(0.78 0.16 155)"
              strokeWidth={2.5}
              fill="url(#velGrad)"
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="oklch(0.72 0.18 265)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
