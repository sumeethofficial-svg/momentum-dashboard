import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_goals",
  title: "List my goals",
  description:
    "Return the signed-in Momentum user's active goals with title, category, priority, target date, progress, risk, and AI insight.",
  inputSchema: {
    priority: z
      .enum(["High", "Med", "Low"])
      .optional()
      .describe("Optional priority filter."),
    risk: z
      .enum(["Low Risk", "On Track", "At Risk", "Critical"])
      .optional()
      .describe("Optional risk filter."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ priority, risk }, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    }
    const { getGoalsForUser } = await import("../store.server");
    const all = getGoalsForUser(ctx.getUserId()!);
    const filtered = all.filter(
      (g) => (!priority || g.priority === priority) && (!risk || g.risk === risk),
    );
    return {
      content: [
        {
          type: "text",
          text:
            filtered.length === 0
              ? "No goals match. Create one from the Momentum dashboard."
              : filtered
                  .map(
                    (g) =>
                      `• ${g.title} — ${g.category} · ${g.priority} · ${g.risk} · ${g.progress}% · target ${g.target}\n  ↳ ${g.insight}`,
                  )
                  .join("\n"),
        },
      ],
      structuredContent: { goals: filtered },
    };
  },
});
