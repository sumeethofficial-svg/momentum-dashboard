import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Priority = "High" | "Med" | "Low";
export type Risk = "Low Risk" | "On Track" | "At Risk" | "Critical";

export type Goal = {
  id: string;
  title: string;
  category: string;
  target: string;
  progress: number;
  priority: Priority;
  risk: Risk;
  insight: string;
  description?: string;
};

export type BriefingIconKey = "alert" | "check" | "clock";

export type BriefingItem = {
  id: string;
  iconKey: BriefingIconKey;
  title: string;
  body: string;
  time: string;
  relatedGoalId?: string;
};

export type ViewKey = "dashboard" | "goals" | "assistant" | "analytics" | "settings";

const initialGoals: Goal[] = [
  {
    id: "g1",
    title: "Launch Q4 Enterprise Product Line",
    category: "Product",
    target: "Dec 15, 2026",
    progress: 78,
    priority: "High",
    risk: "On Track",
    insight: "AI recommends compressing QA cycle by 3 days.",
  },
  {
    id: "g2",
    title: "Close $2.4M Series A Bridge",
    category: "Fundraising",
    target: "Nov 02, 2026",
    progress: 62,
    priority: "High",
    risk: "At Risk",
    insight: "2 investor follow-ups pending — auto-drafted.",
  },
  {
    id: "g3",
    title: "Grow Newsletter to 25k Subscribers",
    category: "Marketing",
    target: "Jan 30, 2027",
    progress: 44,
    priority: "Med",
    risk: "Low Risk",
    insight: "Referral loop lifting weekly growth 12%.",
  },
  {
    id: "g4",
    title: "Ship AI Coach Beta to Design Partners",
    category: "Engineering",
    target: "Aug 22, 2026",
    progress: 91,
    priority: "High",
    risk: "Low Risk",
    insight: "Ready for staged rollout Friday.",
  },
  {
    id: "g5",
    title: "Complete Executive Coaching Program",
    category: "Personal",
    target: "Oct 10, 2026",
    progress: 33,
    priority: "Low",
    risk: "Critical",
    insight: "Missed 2 sessions — reschedule suggested.",
  },
];

const initialBriefing: BriefingItem[] = [
  {
    id: "b1",
    iconKey: "alert",
    title: "Series A goal drifting",
    body: "Draft follow-ups queued for 2 warm investors.",
    time: "8m ago",
    relatedGoalId: "g2",
  },
  {
    id: "b2",
    iconKey: "check",
    title: "Beta launch cleared QA",
    body: "All P0 tickets closed. Ready for Friday rollout.",
    time: "42m ago",
    relatedGoalId: "g4",
  },
  {
    id: "b3",
    iconKey: "clock",
    title: "Coaching session rescheduled",
    body: "Moved to Thursday 4pm — calendar synced.",
    time: "1h ago",
    relatedGoalId: "g5",
  },
];

type Ctx = {
  goals: Goal[];
  briefing: BriefingItem[];
  view: ViewKey;
  setView: (v: ViewKey) => void;
  addGoal: (g: Omit<Goal, "id" | "progress" | "risk" | "insight"> & Partial<Goal>) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  metrics: {
    activeGoals: number;
    onTrackRate: number;
    riskScore: number;
    upcoming: number;
  };
};

const MomentumCtx = createContext<Ctx | null>(null);

export function MomentumProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [briefing] = useState<BriefingItem[]>(initialBriefing);
  const [view, setView] = useState<ViewKey>("dashboard");

  const metrics = useMemo(() => {
    const total = goals.length;
    const onTrack = goals.filter((g) => g.risk === "On Track" || g.risk === "Low Risk").length;
    const riskWeight: Record<Risk, number> = {
      "Low Risk": 10,
      "On Track": 25,
      "At Risk": 60,
      Critical: 90,
    };
    const riskScore = total
      ? Math.round(goals.reduce((s, g) => s + riskWeight[g.risk], 0) / total)
      : 0;
    return {
      activeGoals: total,
      onTrackRate: total ? Math.round((onTrack / total) * 100) : 0,
      riskScore,
      upcoming: goals.filter((g) => g.progress < 100).length,
    };
  }, [goals]);

  const addGoal: Ctx["addGoal"] = (g) => {
    setGoals((prev) => [
      {
        id: `g${Date.now()}`,
        progress: 5,
        risk: "On Track",
        insight: "AI structuring milestones and cadence…",
        ...g,
      } as Goal,
      ...prev,
    ]);
  };

  const updateGoal: Ctx["updateGoal"] = (id, patch) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  };

  return (
    <MomentumCtx.Provider
      value={{ goals, briefing, view, setView, addGoal, updateGoal, metrics }}
    >
      {children}
    </MomentumCtx.Provider>
  );
}

export function useMomentum() {
  const ctx = useContext(MomentumCtx);
  if (!ctx) throw new Error("useMomentum must be used within MomentumProvider");
  return ctx;
}
