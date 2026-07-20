import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_briefing",
  title: "Get executive briefing",
  description:
    "Return a synthesized briefing for the signed-in Momentum user: portfolio health, high-risk goals, and recommended focus areas.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    }
    const { getGoalsForUser } = await import("../store.server");
    const goals = getGoalsForUser(ctx.getUserId()!);
    const total = goals.length;
    if (total === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No goals yet. Create your first goal from the Momentum dashboard, then ask again for a briefing.",
          },
        ],
        structuredContent: { total: 0 },
      };
    }
    const onTrack = goals.filter((g) => g.risk === "On Track" || g.risk === "Low Risk").length;
    const highRisk = goals.filter((g) => g.risk === "At Risk" || g.risk === "Critical");
    const avgProgress = Math.round(goals.reduce((s, g) => s + g.progress, 0) / total);
    const focus = [...goals]
      .sort((a, b) => (a.priority === "High" ? -1 : 1) - (b.priority === "High" ? -1 : 1))
      .slice(0, 3)
      .map((g) => `- ${g.title} (${g.priority}, ${g.risk})`);

    const text = [
      `Portfolio: ${total} active goals · ${Math.round((onTrack / total) * 100)}% on track · avg ${avgProgress}% complete.`,
      "",
      highRisk.length
        ? `High-risk goals (${highRisk.length}):\n${highRisk.map((g) => `- ${g.title} — ${g.risk}: ${g.insight}`).join("\n")}`
        : "No high-risk goals. Keep the cadence.",
      "",
      `Recommended focus this week:\n${focus.join("\n")}`,
    ].join("\n");

    return {
      content: [{ type: "text", text }],
      structuredContent: {
        total,
        onTrackRate: Math.round((onTrack / total) * 100),
        avgProgress,
        highRisk,
      },
    };
  },
});
