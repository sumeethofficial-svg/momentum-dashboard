import { CalendarDays, ChevronRight, Plus, Sparkles, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMomentum, type Goal, type Priority, type Risk } from "./MomentumContext";

const priorityStyle: Record<Priority, string> = {
  High: "bg-danger/15 text-danger border-danger/25",
  Med: "bg-warning/15 text-warning border-warning/25",
  Low: "bg-muted text-muted-foreground border-border",
};

const riskStyle: Record<Risk, string> = {
  "Low Risk": "bg-success/12 text-success",
  "On Track": "bg-primary/12 text-primary",
  "At Risk": "bg-warning/15 text-warning",
  Critical: "bg-danger/15 text-danger",
};

export function GoalsList({
  onInspect,
  onCreate,
  limit,
  title = "Active Goals",
  subtitle = "Prioritized by AI impact score · updated 2 min ago",
}: {
  onInspect: (goal: Goal) => void;
  onCreate?: () => void;
  limit?: number;
  title?: string;
  subtitle?: string;
}) {
  const { goals } = useMomentum();
  const rows = typeof limit === "number" ? goals.slice(0, limit) : goals;

  if (goals.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/60 shadow-elevated">
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <Target className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold tracking-tight">No active goals yet</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Momentum is standing by. Create your first goal and I'll structure milestones,
              forecast risk, and start executing alongside you.
            </p>
          </div>
          {onCreate && (
            <Button
              onClick={onCreate}
              className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Create Your First Goal
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-elevated">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {goals.length} total
        </span>
      </div>

      <ul className="divide-y divide-border">
        {rows.map((g) => (
          <li key={g.id}>
            <button
              type="button"
              onClick={() => onInspect(g)}
              className="group grid w-full grid-cols-1 gap-4 px-6 py-5 text-left transition hover:bg-muted/30 lg:grid-cols-[minmax(0,1fr)_220px_180px_40px] lg:items-center"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                    {g.category}
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                      priorityStyle[g.priority],
                    )}
                  >
                    {g.priority}
                  </span>
                </div>
                <h4 className="mt-1 truncate text-sm font-semibold text-foreground">
                  {g.title}
                </h4>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-primary" />
                  {g.insight}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{g.progress}%</span>
                </div>
                <Progress value={g.progress} className="mt-2 h-1.5 bg-muted" />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("rounded-md px-2 py-1 text-[11px] font-medium", riskStyle[g.risk])}>
                  {g.risk}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="h-3 w-3" />
                  {g.target}
                </span>
              </div>

              <ChevronRight className="hidden h-4 w-4 text-muted-foreground group-hover:text-foreground lg:block" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
