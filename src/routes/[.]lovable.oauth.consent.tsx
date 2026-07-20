import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// Beta namespace typing — keep local so we don't grep node_modules.
type OAuthClient = { name?: string; client_id?: string; logo_uri?: string };
type OAuthDetails = {
  client?: OAuthClient;
  scope?: string;
  redirect_uri?: string;
  redirect_url?: string;
  redirect_to?: string;
};
type OAuthApi = {
  getAuthorizationDetails: (
    id: string,
  ) => Promise<{ data: OAuthDetails | null; error: { message: string } | null }>;
  approveAuthorization: (
    id: string,
  ) => Promise<{ data: OAuthDetails | null; error: { message: string } | null }>;
  denyAuthorization: (
    id: string,
  ) => Promise<{ data: OAuthDetails | null; error: { message: string } | null }>;
};
const oauth = (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  // Browser-only: session lives in localStorage.
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <ConsentShell>
      <h1 className="text-xl font-semibold tracking-tight">Authorization unavailable</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {String((error as Error)?.message ?? error)}
      </p>
    </ConsentShell>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState<"approve" | "deny" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const clientName = details?.client?.name ?? "an app";

  async function decide(approve: boolean) {
    setError(null);
    setBusy(approve ? "approve" : "deny");
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorization_id)
      : await oauth.denyAuthorization(authorization_id);
    if (error) {
      setBusy(null);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(null);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <ConsentShell>
      <h1 className="text-xl font-semibold tracking-tight">
        Connect {clientName} to Momentum
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {clientName} will be able to call Momentum's tools while you are signed in — list
        your goals, create new ones, and read your executive briefing.
      </p>
      <ul className="mt-5 space-y-2 rounded-lg border border-border bg-muted/20 p-4 text-sm">
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
          Read your active goals and progress
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
          Create new goals on your behalf
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
          Generate portfolio briefings
        </li>
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">
        This does not bypass Momentum's permissions or backend policies. You can revoke
        access at any time.
      </p>
      {error && (
        <p role="alert" className="mt-4 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {error}
        </p>
      )}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
        <Button
          onClick={() => decide(true)}
          disabled={busy !== null}
          className="flex-1 bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
        >
          {busy === "approve" ? "Approving…" : "Approve"}
        </Button>
        <Button
          onClick={() => decide(false)}
          disabled={busy !== null}
          variant="outline"
          className="flex-1"
        >
          {busy === "deny" ? "Cancelling…" : "Cancel connection"}
        </Button>
      </div>
    </ConsentShell>
  );
}

function ConsentShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card/70 p-8 backdrop-blur-xl shadow-glow">
        <div className="mb-6 flex items-center gap-2.5">
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
        {children}
      </div>
    </main>
  );
}
