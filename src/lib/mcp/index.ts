import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listGoalsTool from "./tools/list-goals";
import createGoalTool from "./tools/create-goal";
import getBriefingTool from "./tools/get-briefing";

// The OAuth issuer MUST be the direct Supabase host. On publish, SUPABASE_URL
// is rewritten to the `.lovable.cloud` proxy, which mcp-js rejects (RFC 8414
// issuer mismatch). Use the project ref, which survives publish unchanged, via
// the Vite-inlined literal (NOT process.env at module scope).
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "momentum-ai-mcp",
  title: "Momentum AI",
  version: "0.1.0",
  instructions:
    "Momentum AI is an autonomous chief of staff for goal execution. Use `list_goals` to review the signed-in user's active goals (with progress and risk), `create_goal` to add a new goal, and `get_briefing` for a synthesized portfolio briefing with focus areas.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listGoalsTool, createGoalTool, getBriefingTool],
});
