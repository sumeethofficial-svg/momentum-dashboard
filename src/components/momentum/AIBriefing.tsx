import { Sparkles, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { useMomentum, type BriefingItem, type BriefingIconKey } from "./MomentumContext";

const iconMap: Record<BriefingIconKey, { icon: typeof AlertTriangle; tone: string }> = {
  alert: { icon: AlertTriangle, tone: "text-warning bg-warning/15" },
  check: { icon: CheckCircle2, tone: "text-success bg-success/12" },
  clock: { icon: Clock, tone: "text-accent bg-accent/15" },
};

export function AIBriefing({
  onInspect,
  onOpenAssistant,
}: {
  onInspect: (item: BriefingItem) => void;
  onOpenAssistant: () => void;
}) {
  const { briefing } = useMomentum();

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
        {briefing.map((it) => {
          const { icon: Icon, tone } = iconMap[it.iconKey];
          return (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => onInspect(it)}
                className="flex w-full gap-3 rounded-md p-2 -m-2 text-left transition hover:bg-muted/40"
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-medium">{it.title}</div>
                    <div className="shrink-0 text-[10px] text-muted-foreground">{it.time}</div>
                  </div>
                  <p className="text-xs text-muted-foreground">{it.body}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        onClick={onOpenAssistant}
        className="mt-5 w-full rounded-md border border-primary/30 bg-primary/10 py-2 text-xs font-medium text-primary hover:bg-primary/15 transition"
      >
        Open AI Assistant
      </button>
    </div>
  );
}
