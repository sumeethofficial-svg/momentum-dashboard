import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, Sparkles, Target, TrendingUp, Wand2 } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useMomentum, type Goal } from "./MomentumContext";

export type InspectTarget =
  | { kind: "goal"; goalId: string }
  | { kind: "briefing"; briefingId: string };

function analysisFor(goal: Goal) {
  const probability = Math.max(
    5,
    Math.min(
      98,
      goal.progress + (goal.risk === "Low Risk" ? 10 : goal.risk === "On Track" ? 5 : goal.risk === "At Risk" ? -15 : -30),
    ),
  );
  const bottlenecks =
    goal.risk === "Critical"
      ? ["Missed cadence checkpoints", "Owner bandwidth overloaded", "No fallback plan defined"]
      : goal.risk === "At Risk"
        ? ["Slow external dependencies", "Ambiguous next milestone", "Stakeholder decisions pending"]
        : ["Minor scope creep detected", "Handoffs slower than baseline"];
  const actions =
    goal.risk === "Critical" || goal.risk === "At Risk"
      ? [
          {
            label: "Reschedule deadline by 7 days",
            patch: { risk: "On Track" as const, insight: "Deadline extended — AI rebalanced cadence." },
          },
          {
            label: "Auto-draft stakeholder update",
            patch: { insight: "Update drafted — awaiting your approval." },
          },
          {
            label: "Boost progress with quick wins queue",
            patch: {
              progress: Math.min(100, goal.progress + 8),
              risk: "On Track" as const,
              insight: "AI unblocked 3 quick wins.",
            },
          },
        ]
      : [
          {
            label: "Compress QA cycle by 3 days",
            patch: {
              progress: Math.min(100, goal.progress + 5),
              insight: "QA compressed — velocity +12%.",
            },
          },
          {
            label: "Lock scope for current sprint",
            patch: { insight: "Scope locked — reviewing weekly." },
          },
          {
            label: "Promote to Low Risk",
            patch: { risk: "Low Risk" as const, insight: "Risk downgraded by AI monitor." },
          },
        ];
  return { probability, bottlenecks, actions };
}

export function AIRiskSheet({
  target,
  onClose,
}: {
  target: InspectTarget | null;
  onClose: () => void;
}) {
  const { goals, briefing, updateGoal } = useMomentum();

  const goal = useMemo<Goal | null>(() => {
    if (!target) return null;
    if (target.kind === "goal") return goals.find((g) => g.id === target.goalId) ?? null;
    const b = briefing.find((x) => x.id === target.briefingId);
    if (!b) return null;
    return goals.find((g) => g.id === b.relatedGoalId) ?? null;
  }, [target, goals, briefing]);

  const briefingItem =
    target?.kind === "briefing" ? briefing.find((b) => b.id === target.briefingId) ?? null : null;

  const analysis = goal ? analysisFor(goal) : null;

  return (
    <Sheet open={!!target} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-card border-border">
        <SheetHeader>
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <SheetTitle className="text-lg tracking-tight">
            {briefingItem?.title ?? goal?.title ?? "AI Risk Analysis"}
          </SheetTitle>
          <SheetDescription>
            {briefingItem
              ? briefingItem.body
              : goal
                ? `${goal.category} · target ${goal.target}`
                : "Select an item to inspect."}
          </SheetDescription>
        </SheetHeader>

        {goal && analysis && (
          <div className="mt-6 space-y-6">
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  Completion probability
                </span>
                <span className="font-semibold text-foreground">{analysis.probability}%</span>
              </div>
              <Progress value={analysis.probability} className="mt-2 h-1.5 bg-muted" />
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-accent" />
                  Current progress
                </span>
                <span className="font-medium text-foreground">{goal.progress}%</span>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Bottlenecks
              </h4>
              <ul className="space-y-2">
                {analysis.bottlenecks.map((b) => (
                  <li key={b} className="flex items-start gap-2 rounded-md border border-border bg-background/40 p-3 text-sm">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Suggested corrective actions
              </h4>
              <ul className="space-y-2">
                {analysis.actions.map((a, i) => (
                  <li
                    key={a.label}
                    className="flex items-start gap-3 rounded-md border border-border bg-background/40 p-3 text-sm"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/12 text-[11px] font-semibold text-primary">
                      {i + 1}
                    </div>
                    <span className="flex-1">{a.label}</span>
                    <CheckCircle2 className="h-4 w-4 text-success/70" />
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={() => {
                const top = analysis.actions[0];
                updateGoal(goal.id, top.patch);
                toast.success("AI recommendation applied", {
                  description: top.label,
                });
                onClose();
              }}
              className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
            >
              <Wand2 className="h-4 w-4" />
              Apply AI Recommendation
            </Button>
          </div>
        )}

        {!goal && briefingItem && (
          <div className="mt-6 rounded-md border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
            No linked goal for this briefing item yet.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
