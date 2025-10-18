import * as z from "zod";

export const FeedbackSchema = z.object({
  text: z.string(),
  email: z.email().optional(),
});
