import { LayoutDashboard, Target, Sparkles, BarChart3, Settings, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMomentum, type ViewKey } from "./MomentumContext";

const nav: { key: ViewKey; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "goals", label: "Goals", icon: Target },
  { key: "assistant", label: "AI Assistant", icon: Sparkles, badge: "New" },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const { view, setView } = useMomentum();

  return (
    <aside className="hidden md:flex md:w-64 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2.5 px-6 border-b border-sidebar-border">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
          <Zap className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">Momentum</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            AI · Chief of Staff
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        <div className="px-3 pt-3 pb-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Workspace
        </div>
        {nav.map((item) => {
          const Icon = item.icon;
          const active = view === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl border border-sidebar-border bg-gradient-surface p-4">
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          AI Copilot online
        </div>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          3 optimizations queued for review this morning.
        </p>
        <button
          onClick={() => setView("assistant")}
          className="mt-3 w-full rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition"
        >
          Review briefing
        </button>
      </div>
    </aside>
  );
}
