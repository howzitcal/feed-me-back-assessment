import * as z from "zod";

export const FeedbackSentimentAnalysisSchema = z.object({
  summary: z.string(),
  sentiment: z.enum(["positive", "negative", "neutral"]),
  tags: z.array(z.string()),
  priority: z.number().min(0).max(3),
  nextAction: z.string(),
});
