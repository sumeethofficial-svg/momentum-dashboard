import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthProfile = {
  user: User | null;
  firstName: string;
  fullName: string;
  initials: string;
  avatarUrl: string | null;
  email: string | null;
  loading: boolean;
};

function deriveProfile(user: User | null): Omit<AuthProfile, "loading"> {
  if (!user) {
    return {
      user: null,
      firstName: "Alex",
      fullName: "Alex Morgan",
      initials: "AM",
      avatarUrl: null,
      email: null,
    };
  }
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const fullName =
    (meta.full_name as string) ||
    (meta.name as string) ||
    [meta.given_name, meta.family_name].filter(Boolean).join(" ").trim() ||
    user.email?.split("@")[0] ||
    "You";
  const firstName =
    (meta.given_name as string) ||
    fullName.split(" ")[0] ||
    "You";
  const parts = fullName.split(/\s+/).filter(Boolean);
  const initials =
    (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")
      ? ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase()
      : (user.email?.[0] ?? "U").toUpperCase();
  const avatarUrl =
    (meta.avatar_url as string) || (meta.picture as string) || null;
  return {
    user,
    firstName,
    fullName,
    initials,
    avatarUrl,
    email: user.email ?? null,
  };
}

export function useAuth(): AuthProfile {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { ...deriveProfile(user), loading };
}
