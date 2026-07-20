import { useEffect } from "react";
import { CalendarClock, Sparkles, Target, TrendingUp, Wand2, Zap } from "lucide-react";
import { toast } from "sonner";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useMomentum } from "./MomentumContext";

export function CommandPalette({
  open,
  onOpenChange,
  onCreateGoal,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreateGoal: () => void;
}) {
  const { goals, updateGoal, setView } = useMomentum();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  function run(fn: () => void) {
    onOpenChange(false);
    fn();
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Ask Momentum anything, or run a command…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick actions">
          <CommandItem
            onSelect={() =>
              run(() => {
                let count = 0;
                goals.forEach((g) => {
                  if (g.risk === "At Risk" || g.risk === "Critical") {
                    updateGoal(g.id, {
                      risk: "On Track",
                      insight: "Deadline rescheduled by AI.",
                    });
                    count += 1;
                  }
                });
                toast.success("Drifting goals rescheduled", {
                  description: `${count} goal${count === 1 ? "" : "s"} rebalanced.`,
                });
              })
            }
          >
            <CalendarClock className="h-4 w-4 text-primary" />
            Reschedule drifting goals
          </CommandItem>
          <CommandItem
            onSelect={() =>
              run(() =>
                toast("Weekly summary ready", {
                  description: "Momentum drafted a 5-bullet recap of this week's execution.",
                  icon: <Sparkles className="h-4 w-4 text-primary" />,
                }),
              )
            }
          >
            <Sparkles className="h-4 w-4 text-accent" />
            Summarize this week
          </CommandItem>
          <CommandItem onSelect={() => run(onCreateGoal)}>
            <Target className="h-4 w-4 text-primary" />
            Create new goal
          </CommandItem>
          <CommandItem
            onSelect={() =>
              run(() => {
                goals.forEach((g) =>
                  updateGoal(g.id, {
                    progress: Math.min(100, g.progress + 5),
                  }),
                );
                toast.success("Momentum boosted", { description: "+5% progress applied across goals." });
              })
            }
          >
            <Wand2 className="h-4 w-4 text-accent" />
            Boost momentum on all goals
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => run(() => setView("dashboard"))}>
            <Zap className="h-4 w-4 text-primary" />
            Go to Dashboard
          </CommandItem>
          <CommandItem onSelect={() => run(() => setView("goals"))}>
            <Target className="h-4 w-4" />
            Go to Goals
          </CommandItem>
          <CommandItem onSelect={() => run(() => setView("assistant"))}>
            <Sparkles className="h-4 w-4" />
            Open AI Assistant
          </CommandItem>
          <CommandItem onSelect={() => run(() => setView("analytics"))}>
            <TrendingUp className="h-4 w-4" />
            View Analytics
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
