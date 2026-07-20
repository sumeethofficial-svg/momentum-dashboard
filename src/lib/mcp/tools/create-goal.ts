import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "create_goal",
  title: "Create a goal",
  description:
    "Create a new goal for the signed-in Momentum user. Momentum AI will structure milestones and monitor risk.",
  inputSchema: {
    title: z.string().trim().min(1).describe("Short outcome-oriented title."),
    category: z
      .string()
      .trim()
      .min(1)
      .describe("e.g. Product, Fundraising, Marketing, Engineering, Personal, Operations."),
    target: z
      .string()
      .trim()
      .min(1)
      .describe("Target deadline as a human-readable string (e.g. 'Dec 15, 2026')."),
    priority: z.enum(["High", "Med", "Low"]).default("Med"),
    description: z.string().trim().optional(),
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  handler: async (input, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    }
    const { addGoalForUser } = await import("../store.server");
    const goal = addGoalForUser(ctx.getUserId()!, input);
    return {
      content: [
        { type: "text", text: `Created goal "${goal.title}" (${goal.category} · ${goal.priority}).` },
      ],
      structuredContent: { goal },
    };
  },
});
