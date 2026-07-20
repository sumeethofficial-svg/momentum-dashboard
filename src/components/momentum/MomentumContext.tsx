import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

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

type Ctx = {
  goals: Goal[];
  briefing: BriefingItem[];
  view: ViewKey;
  setView: (v: ViewKey) => void;
  addGoal: (g: Omit<Goal, "id" | "progress" | "risk" | "insight"> & Partial<Goal>) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  metrics: {
    activeGoals: number;
    onTrackRate: number | null;
    riskScore: number | null;
    upcoming: number;
  };
};

const MomentumCtx = createContext<Ctx | null>(null);

const STORAGE_PREFIX = "momentum:goals:";

function loadGoals(userId: string | null): Goal[] {
  if (typeof window === "undefined" || !userId) return [];
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + userId);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Goal[]) : [];
  } catch {
    return [];
  }
}

export function MomentumProvider({
  children,
  userId = null,
}: {
  children: ReactNode;
  userId?: string | null;
}) {
  const [goals, setGoals] = useState<Goal[]>(() => loadGoals(userId));
  const [briefing] = useState<BriefingItem[]>([]);
  const [view, setView] = useState<ViewKey>("dashboard");

  // Reload when user changes
  useEffect(() => {
    setGoals(loadGoals(userId));
  }, [userId]);

  // Persist on change
  useEffect(() => {
    if (typeof window === "undefined" || !userId) return;
    try {
      localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(goals));
    } catch {
      /* ignore quota errors */
    }
  }, [goals, userId]);

  const metrics = useMemo(() => {
    const total = goals.length;
    const onTrack = goals.filter((g) => g.risk === "On Track" || g.risk === "Low Risk").length;
    const riskWeight: Record<Risk, number> = {
      "Low Risk": 10,
      "On Track": 25,
      "At Risk": 60,
      Critical: 90,
    };
    return {
      activeGoals: total,
      onTrackRate: total ? Math.round((onTrack / total) * 100) : null,
      riskScore: total
        ? Math.round(goals.reduce((s, g) => s + riskWeight[g.risk], 0) / total)
        : null,
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
