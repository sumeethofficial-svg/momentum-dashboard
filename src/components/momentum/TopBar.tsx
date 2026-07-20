import { Bell, Search, Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";

export function TopBar({
  onCreateGoal,
  onOpenCommand,
}: {
  onCreateGoal: () => void;
  onOpenCommand: () => void;
}) {
  const { fullName, initials, avatarUrl, email } = useAuth();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/70 px-4 md:px-8 backdrop-blur-xl">
      <button
        onClick={onOpenCommand}
        className="group relative hidden md:flex flex-1 max-w-md items-center rounded-md border border-input bg-muted/40 pl-9 pr-3 h-9 text-left text-sm text-muted-foreground hover:border-primary/40 hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-ring/40 transition"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <span className="truncate">Ask Momentum anything…</span>
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 items-center rounded border border-border bg-background px-1.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      <button
        onClick={onOpenCommand}
        aria-label="Open command palette"
        className="md:hidden flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
      >
        <Search className="h-4 w-4" />
      </button>

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
              <Avatar className="h-9 w-9 ring-2 ring-primary/30">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt={fullName} /> : null}
                <AvatarFallback className="bg-gradient-accent text-accent-foreground text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-medium">{fullName}</div>
              {email ? (
                <div className="text-xs font-normal text-muted-foreground truncate">
                  {email}
                </div>
              ) : null}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={signOut}>
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
