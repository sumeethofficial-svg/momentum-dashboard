import { Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TopBar({ onCreateGoal }: { onCreateGoal: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/70 px-4 md:px-8 backdrop-blur-xl">
      <div className="relative hidden md:flex flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Ask Momentum anything…"
          className="h-9 w-full rounded-md border border-input bg-muted/40 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 items-center rounded border border-border bg-background px-1.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-medium text-primary">System Active</span>
        </div>

        <Button
          onClick={onCreateGoal}
          className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition"
        >
          <Plus className="h-4 w-4" />
          Create Goal
        </Button>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground transition">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        <Avatar className="h-9 w-9 ring-2 ring-primary/30">
          <AvatarImage src="" alt="Alex Morgan" />
          <AvatarFallback className="bg-gradient-accent text-accent-foreground text-xs font-semibold">
            AM
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
