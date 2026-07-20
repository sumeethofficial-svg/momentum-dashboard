import { Target, TrendingUp, ShieldAlert, CalendarClock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMomentum } from "./MomentumContext";

type Tone = "primary" | "accent" | "warning" | "danger";

const toneStyles: Record<Tone, string> = {
  primary: "bg-primary/12 text-primary",
  accent: "bg-accent/15 text-accent",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
};

export function MetricCards() {
  const { metrics } = useMomentum();

  const cards: {
    label: string;
    value: string;
    delta: string;
    trend: "up" | "down";
    icon: LucideIcon;
    tone: Tone;
    hint: string;
  }[] = [
    {
      label: "Active Goals",
      value: String(metrics.activeGoals),
      delta: "Live count",
      trend: "up",
      icon: Target,
      tone: "primary",
      hint: "Across all workstreams",
    },
    {
      label: "On-Track Rate",
      value: `${metrics.onTrackRate}%`,
      delta: "+6.4% vs last month",
      trend: "up",
      icon: TrendingUp,
      tone: "accent",
      hint: "Pace ahead of forecast",
    },
    {
      label: "AI Risk Score",
      value: `${metrics.riskScore} / 100`,
      delta: "-8 pts since Monday",
      trend: "down",
      icon: ShieldAlert,
      tone: "warning",
      hint: "Lower is safer",
    },
    {
      label: "Upcoming Deadlines",
      value: String(metrics.upcoming),
      delta: "Next in 3 days",
      trend: "up",
      icon: CalendarClock,
      tone: "danger",
      hint: "Prioritized by AI",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((m) => {
        const Icon = m.icon;
        const TrendIcon = m.trend === "up" ? ArrowUpRight : ArrowDownRight;
        return (
          <div
            key={m.label}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-elevated transition hover:border-primary/40"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition" />
            <div className="flex items-start justify-between">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", toneStyles[m.tone])}>
                <Icon className="h-5 w-5" />
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium",
                  m.trend === "up" ? "bg-success/10 text-success" : "bg-warning/10 text-warning",
                )}
              >
                <TrendIcon className="h-3 w-3" />
                {m.delta}
              </div>
            </div>
            <div className="mt-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                {m.label}
              </div>
              <div className="mt-1 text-3xl font-semibold tracking-tight">{m.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{m.hint}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
