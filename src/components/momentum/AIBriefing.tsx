import { Sparkles, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

const items = [
  {
    icon: AlertTriangle,
    tone: "text-warning bg-warning/15",
    title: "Series A goal drifting",
    body: "Draft follow-ups queued for 2 warm investors.",
    time: "8m ago",
  },
  {
    icon: CheckCircle2,
    tone: "text-success bg-success/12",
    title: "Beta launch cleared QA",
    body: "All P0 tickets closed. Ready for Friday rollout.",
    time: "42m ago",
  },
  {
    icon: Clock,
    tone: "text-accent bg-accent/15",
    title: "Coaching session rescheduled",
    body: "Moved to Thursday 4pm — calendar synced.",
    time: "1h ago",
  },
];

export function AIBriefing() {
  return (
    <div className="rounded-xl border border-border bg-gradient-surface p-6 shadow-elevated">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Morning briefing</h3>
            <p className="text-[11px] text-muted-foreground">Autonomous — Jul 20, 08:32</p>
          </div>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-widest text-primary">
          Live
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-foreground/90">
        You're pacing <span className="text-primary font-medium">+18% ahead</span> of quarterly plan.
        Two goals need decisions today; I've prepared drafts and next steps.
      </p>

      <ul className="mt-5 space-y-3">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <li key={it.title} className="flex gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${it.tone}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate text-sm font-medium">{it.title}</div>
                  <div className="shrink-0 text-[10px] text-muted-foreground">{it.time}</div>
                </div>
                <p className="text-xs text-muted-foreground">{it.body}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <button className="mt-5 w-full rounded-md border border-primary/30 bg-primary/10 py-2 text-xs font-medium text-primary hover:bg-primary/15 transition">
        Open AI Assistant
      </button>
    </div>
  );
}
