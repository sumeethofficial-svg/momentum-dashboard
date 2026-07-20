import { CalendarDays, ChevronRight, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Priority = "High" | "Med" | "Low";
type Risk = "Low Risk" | "On Track" | "At Risk" | "Critical";

type Goal = {
  title: string;
  category: string;
  target: string;
  progress: number;
  priority: Priority;
  risk: Risk;
  insight: string;
};

const goals: Goal[] = [
  {
    title: "Launch Q4 Enterprise Product Line",
    category: "Product",
    target: "Dec 15, 2026",
    progress: 78,
    priority: "High",
    risk: "On Track",
    insight: "AI recommends compressing QA cycle by 3 days.",
  },
  {
    title: "Close $2.4M Series A Bridge",
    category: "Fundraising",
    target: "Nov 02, 2026",
    progress: 62,
    priority: "High",
    risk: "At Risk",
    insight: "2 investor follow-ups pending — auto-drafted.",
  },
  {
    title: "Grow Newsletter to 25k Subscribers",
    category: "Marketing",
    target: "Jan 30, 2027",
    progress: 44,
    priority: "Med",
    risk: "Low Risk",
    insight: "Referral loop lifting weekly growth 12%.",
  },
  {
    title: "Ship AI Coach Beta to Design Partners",
    category: "Engineering",
    target: "Aug 22, 2026",
    progress: 91,
    priority: "High",
    risk: "Low Risk",
    insight: "Ready for staged rollout Friday.",
  },
  {
    title: "Complete Executive Coaching Program",
    category: "Personal",
    target: "Oct 10, 2026",
    progress: 33,
    priority: "Low",
    risk: "Critical",
    insight: "Missed 2 sessions — reschedule suggested.",
  },
];

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

export function GoalsList() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-elevated">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Active Goals</h3>
          <p className="text-sm text-muted-foreground">
            Prioritized by AI impact score · updated 2 min ago
          </p>
        </div>
        <button className="text-xs font-medium text-primary hover:underline">
          View all →
        </button>
      </div>

      <ul className="divide-y divide-border">
        {goals.map((g) => (
          <li
            key={g.title}
            className="group grid grid-cols-1 gap-4 px-6 py-5 transition hover:bg-muted/30 lg:grid-cols-[minmax(0,1fr)_220px_180px_40px] lg:items-center"
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
          </li>
        ))}
      </ul>
    </div>
  );
}
