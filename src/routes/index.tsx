import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppSidebar } from "@/components/momentum/AppSidebar";
import { TopBar } from "@/components/momentum/TopBar";
import { MetricCards } from "@/components/momentum/MetricCards";
import { VelocityChart } from "@/components/momentum/VelocityChart";
import { GoalsList } from "@/components/momentum/GoalsList";
import { AIBriefing } from "@/components/momentum/AIBriefing";
import { CreateGoalModal } from "@/components/momentum/CreateGoalModal";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onCreateGoal={() => setOpen(true)} />

        <main className="relative flex-1 overflow-x-hidden px-4 py-8 md:px-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-64 grid-bg opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />

          <div className="relative mx-auto max-w-7xl space-y-8">
            <section className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Executive dashboard
                </div>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
                  Good morning, Alex.
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Here's where your goals stand — and what Momentum is handling for you today.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Autonomous mode · Level 3
              </div>
            </section>

            <MetricCards />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <VelocityChart />
              </div>
              <AIBriefing />
            </div>

            <GoalsList />

            <footer className="pt-4 pb-8 text-center text-xs text-muted-foreground">
              Momentum AI · Your autonomous chief of staff
            </footer>
          </div>
        </main>
      </div>

      <CreateGoalModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
