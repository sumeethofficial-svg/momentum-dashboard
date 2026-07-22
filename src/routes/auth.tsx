import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" ? s.next : "",
  }),
  component: AuthPage,
});

// Only allow same-origin relative paths so callers can't punt users to
// arbitrary external URLs.
function safeNext(raw: string): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const target = safeNext(next);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.replace(target);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) window.location.replace(target);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, target]);

  async function signIn() {
    setBusy(true);
    try {
      const host = window.location.hostname;
      // Lovable's managed broker only whitelists lovable.app / lovable.dev
      // origins (and localhost during editor preview). Everywhere else — e.g.
      // vercel.app, custom domains, self-hosted — go through Supabase's
      // standard OAuth redirect flow, which returns to /auth/callback.
      const isLovableHost =
        host === "localhost" ||
        host === "127.0.0.1" ||
        host.endsWith(".lovable.app") ||
        host.endsWith(".lovable.dev");

      if (isLovableHost) {
        const redirectUri =
          window.location.origin +
          "/auth" +
          (target !== "/" ? `?next=${encodeURIComponent(target)}` : "");
        const result = await lovable.auth.signInWithOAuth("google", {
          redirect_uri: redirectUri,
        });
        if (result.error) {
          toast.error("Sign-in failed", { description: String(result.error) });
          setBusy(false);
          return;
        }
        if (result.redirected) return;
        window.location.replace(target);
        return;
      }

      // External host (Vercel, custom domain): use Supabase's OAuth redirect.
      // The Vercel origin MUST be added to Supabase's redirect allow-list.
      const callback =
        window.location.origin +
        "/auth/callback" +
        (target !== "/" ? `?next=${encodeURIComponent(target)}` : "");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callback },
      });
      if (error) {
        toast.error("Sign-in failed", { description: error.message });
        setBusy(false);
        return;
      }
      // Browser will redirect to Google.
    } catch (err) {
      toast.error("Sign-in failed", { description: (err as Error).message });
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card/70 p-8 backdrop-blur-xl shadow-glow">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Zap className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-base font-semibold tracking-tight">Momentum</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              AI · Chief of Staff
            </div>
          </div>
        </div>

        <h1 className="mt-8 text-2xl font-semibold tracking-tight">
          Sign in to your command center
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Momentum executes your goals autonomously. Sign in to sync your portfolio
          and get your morning briefing.
        </p>

        <Button
          onClick={signIn}
          disabled={busy}
          className="mt-8 w-full h-11 bg-white text-neutral-900 hover:bg-neutral-100"
        >
          <GoogleIcon />
          {busy ? "Redirecting…" : "Continue with Google"}
        </Button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to our Terms & Privacy.
        </p>
      </div>
      <Toaster />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44a5.51 5.51 0 01-2.39 3.62v3h3.86c2.26-2.09 3.58-5.17 3.58-8.86z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.07.72-2.44 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.11A11.99 11.99 0 0012 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.2 7.2 0 014.89 12c0-.8.14-1.57.38-2.29V6.6H1.29a12 12 0 000 10.8l3.98-3.11z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.18 15.24 0 12 0 7.31 0 3.25 2.69 1.29 6.6l3.98 3.11C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}
