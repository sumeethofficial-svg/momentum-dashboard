import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/momentum/AppSidebar";
import { TopBar } from "@/components/momentum/TopBar";
import { MetricCards } from "@/components/momentum/MetricCards";
import { VelocityChart } from "@/components/momentum/VelocityChart";
import { GoalsList } from "@/components/momentum/GoalsList";
import { AIBriefing } from "@/components/momentum/AIBriefing";
import { CreateGoalModal } from "@/components/momentum/CreateGoalModal";
import { AIRiskSheet, type InspectTarget } from "@/components/momentum/AIRiskSheet";
import { CommandPalette } from "@/components/momentum/CommandPalette";
import { MomentumProvider, useMomentum } from "@/components/momentum/MomentumContext";
import { AnalyticsView, AssistantView, SettingsView } from "@/components/momentum/Views";

export const Route = createFileRoute("/_authenticated/")({
  component: Page,
});

function Page() {
  return (
    <MomentumProvider>
      <Dashboard />
      <Toaster />
    </MomentumProvider>
  );
}

const viewTitles: Record<string, { eyebrow: string; title: string; sub: string }> = {
  dashboard: {
    eyebrow: "Executive dashboard",
    title: "Good morning, Alex.",
    sub: "Here's where your goals stand — and what Momentum is handling for you today.",
  },
  goals: {
    eyebrow: "Portfolio",
    title: "All goals",
    sub: "Every objective, ranked by AI impact score.",
  },
  assistant: {
    eyebrow: "Copilot",
    title: "AI Assistant",
    sub: "Your always-on chief of staff.",
  },
  analytics: {
    eyebrow: "Insights",
    title: "Analytics",
    sub: "Execution velocity and portfolio health.",
  },
  settings: {
    eyebrow: "Preferences",
    title: "Settings",
    sub: "Tune Momentum to fit your operating rhythm.",
  },
};

function Dashboard() {
  const { view, setView } = useMomentum();
  const [createOpen, setCreateOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [inspect, setInspect] = useState<InspectTarget | null>(null);

  const header = viewTitles[view];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          onCreateGoal={() => setCreateOpen(true)}
          onOpenCommand={() => setCmdOpen(true)}
        />

        <main className="relative flex-1 overflow-x-hidden px-4 py-8 md:px-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-64 grid-bg opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />

          <div className="relative mx-auto max-w-7xl space-y-8">
            <section className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  {header.eyebrow}
                </div>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
                  {header.title}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">{header.sub}</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Autonomous mode · Level 3
              </div>
            </section>

            {view === "dashboard" && (
              <>
                <MetricCards />
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                  <div className="xl:col-span-2">
                    <VelocityChart />
                  </div>
                  <AIBriefing
                    onInspect={(item) =>
                      setInspect({ kind: "briefing", briefingId: item.id })
                    }
                    onOpenAssistant={() => setView("assistant")}
                  />
                </div>
                <GoalsList
                  onInspect={(g) => setInspect({ kind: "goal", goalId: g.id })}
                />
              </>
            )}

            {view === "goals" && (
              <GoalsList
                onInspect={(g) => setInspect({ kind: "goal", goalId: g.id })}
                title="All goals"
                subtitle="Full portfolio · click any goal to inspect AI analysis."
              />
            )}

            {view === "assistant" && <AssistantView />}
            {view === "analytics" && <AnalyticsView />}
            {view === "settings" && <SettingsView />}

            <footer className="pt-4 pb-8 text-center text-xs text-muted-foreground">
              Momentum AI · Your autonomous chief of staff
            </footer>
          </div>
        </main>
      </div>

      <CreateGoalModal open={createOpen} onOpenChange={setCreateOpen} />
      <AIRiskSheet target={inspect} onClose={() => setInspect(null)} />
      <CommandPalette
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        onCreateGoal={() => setCreateOpen(true)}
      />
    </div>
  );
}
