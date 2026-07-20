import { BarChart3, Bell, Lock, MessageSquare, Sparkles, User } from "lucide-react";
import { VelocityChart } from "./VelocityChart";
import { MetricCards } from "./MetricCards";
import { useMomentum } from "./MomentumContext";

export function AssistantView() {
  const suggestions = [
    "Reschedule drifting goals",
    "Summarize this week's wins",
    "Prep me for Thursday's board update",
    "What should I focus on today?",
  ];
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-gradient-surface p-6 shadow-elevated">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">AI Assistant</h2>
            <p className="text-sm text-muted-foreground">
              Your autonomous chief of staff — always on, always briefing you.
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="rounded-lg border border-border bg-background/40 p-3 text-sm">
              Good morning, Alex. You're pacing +18% ahead of your quarter. I've flagged 2 goals for decisions today and prepared drafts for the Series A follow-ups.
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="rounded-lg border border-border bg-background/40 p-3 text-sm text-muted-foreground italic">
              Ask a question or pick a suggestion below…
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {suggestions.map((s) => (
            <button
              key={s}
              className="rounded-md border border-border bg-muted/30 px-3 py-2 text-left text-sm hover:border-primary/40 hover:bg-muted/50 transition"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AnalyticsView() {
  const { metrics, goals } = useMomentum();
  const byCategory = goals.reduce<Record<string, number>>((acc, g) => {
    acc[g.category] = (acc[g.category] ?? 0) + 1;
    return acc;
  }, {});
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Analytics</h2>
          <p className="text-sm text-muted-foreground">Execution velocity and portfolio health.</p>
        </div>
      </div>
      <MetricCards />
      <VelocityChart />
      <div className="rounded-xl border border-border bg-card p-6 shadow-elevated">
        <h3 className="text-sm font-semibold tracking-tight">Goals by category</h3>
        <div className="mt-4 space-y-3">
          {Object.entries(byCategory).map(([cat, n]) => (
            <div key={cat}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{cat}</span>
                <span className="font-medium text-foreground">{n}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-muted">
                <div
                  className="h-1.5 rounded-full bg-gradient-primary"
                  style={{ width: `${Math.min(100, (n / metrics.activeGoals) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SettingsView() {
  const items = [
    { icon: User, label: "Profile", hint: "Alex Morgan · alex@momentum.ai" },
    { icon: Bell, label: "Notifications", hint: "Daily briefing at 8:30am" },
    { icon: Sparkles, label: "AI Autonomy", hint: "Level 3 · takes action, asks on high-risk" },
    { icon: Lock, label: "Security", hint: "2FA enabled" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/12 text-primary">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Settings</h2>
          <p className="text-sm text-muted-foreground">Configure Momentum to run your world.</p>
        </div>
      </div>
      <div className="divide-y divide-border rounded-xl border border-border bg-card shadow-elevated">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.label} className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{it.label}</div>
                <div className="text-xs text-muted-foreground">{it.hint}</div>
              </div>
              <button className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                Edit
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
