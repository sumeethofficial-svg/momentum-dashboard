// Server-only in-memory store for MCP tools. Not shared with the browser
// dashboard (which persists to per-user localStorage). This gives external
// assistants a usable per-user surface without introducing a Supabase table.
// Data is scoped by userId (from the verified OAuth token's sub claim) and
// lives for the lifetime of the Worker instance.

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
  createdAt: string;
};

const store = new Map<string, Goal[]>();

export function getGoalsForUser(userId: string): Goal[] {
  return store.get(userId) ?? [];
}

export function addGoalForUser(
  userId: string,
  input: {
    title: string;
    category: string;
    target: string;
    priority?: Priority;
    description?: string;
  },
): Goal {
  const goal: Goal = {
    id: `g${Date.now()}`,
    title: input.title,
    category: input.category,
    target: input.target,
    priority: input.priority ?? "Med",
    description: input.description,
    progress: 5,
    risk: "On Track",
    insight: "AI structuring milestones and cadence…",
    createdAt: new Date().toISOString(),
  };
  const list = store.get(userId) ?? [];
  store.set(userId, [goal, ...list]);
  return goal;
}
