import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" ? s.next : "/",
  }),
  component: AuthCallback,
});

function safeNext(raw: string): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

function AuthCallback() {
  const { next } = Route.useSearch();
  const target = safeNext(next);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function finish() {
      // Supabase JS with detectSessionInUrl handles both PKCE ?code= and
      // implicit #access_token= flows automatically when the client is created.
      // We just wait for the session, then redirect.
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        window.location.replace(target);
        return;
      }
      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        if (session && !cancelled) window.location.replace(target);
      });
      // Timeout safety net.
      setTimeout(() => {
        if (cancelled) return;
        supabase.auth.getSession().then(({ data: d }) => {
          if (d.session) window.location.replace(target);
          else setError("Sign-in did not complete. Please try again.");
        });
      }, 4000);
      return () => sub.subscription.unsubscribe();
    }

    void finish();
    return () => {
      cancelled = true;
    };
  }, [target]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">
          {error ?? "Completing sign-in…"}
        </p>
        {error && (
          <a
            href="/auth"
            className="mt-4 inline-block text-sm text-primary underline"
          >
            Back to sign-in
          </a>
        )}
      </div>
    </div>
  );
}
