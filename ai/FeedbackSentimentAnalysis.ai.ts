import { makeOpenAiRequest } from "@/lib/ai/OpenAIService";
import { getLogger } from "@/lib/wrappers/request";
import { FeedbackSentimentAnalysisSchema } from "@/schemas/FeedbackSentimentAnalysis.schema";

export default async (feedback: string) => {
  const logger = getLogger();
  logger.info("Starting FeedbackSentimentAnalysis");
  const feedbackSentimentResponse = await makeOpenAiRequest({
    instructions:
      "create a sentiment report for this customer feedback, return json object: {summary: string, sentiment: ('positive'|'neutral'|'negative'), tags:  string[](1-5 short nouns) , priority: (0|1|2|3) 0 - worst, 4 - best, nextAction: string}. do not return any Personally Identifiable Information",
    input: feedback,
    jsonOutput: true,
    zodSchema: FeedbackSentimentAnalysisSchema,
  });

  if (
    feedbackSentimentResponse.success == true &&
    feedbackSentimentResponse?.json
  ) {
    return {
      ...feedbackSentimentResponse.json,
      model: feedbackSentimentResponse.model,
    };
  }
};
