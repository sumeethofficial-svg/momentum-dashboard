import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // If OAuth returned with a hash fragment (#access_token=...), give the
    // Supabase client a chance to consume it before we check for a session.
    if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
      // Wait for supabase-js (detectSessionInUrl) to parse the hash and set
      // the session. Poll briefly instead of racing.
      for (let i = 0; i < 20; i++) {
        const { data } = await supabase.auth.getSession();
        if (data.session) break;
        await new Promise((r) => setTimeout(r, 100));
      }
      // Clean the URL so the tokens aren't left in the address bar / history.
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.search,
      );
    }
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthenticatedShell,
});

function AuthenticatedShell() {
  // Defer client-only children until after mount so any browser-extension
  // DOM mutations (e.g. webcrx attribute) can't cause a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <Outlet />;
}

