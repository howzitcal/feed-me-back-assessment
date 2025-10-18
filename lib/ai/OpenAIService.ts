import OpenAI from "openai";
import { ZodObject, ZodTypeAny } from "zod";
import { createMd5, delay } from "../helpers";
import { getTraceId } from "../request/storage";
import { getLogger } from "../wrappers/request";

const OPEN_AI_KEY = process.env.OPEN_AI_KEY;
const DEFAULT_MODEL = process.env.OPEN_AI_DEFAULT_MODEL || "gpt-5-nano";

type AiResponse = {
  success: boolean;
  model: string;
  attempts: number;
  response?: OpenAI.Responses.Response;
  json?: Object | null;
};

type AiRequest = {
  input: string;
  instructions: string;
  model?: string | undefined;
  jsonOutput?: boolean | undefined;
  responseParams?: OpenAI.Responses.ResponseCreateParams;
  zodSchema: ZodObject;
};

export const makeOpenAiRequest = async (parameters: AiRequest) => {
  let attempts = 0;
  let json = null;
  const logger = getLogger();
  const startedAt = Date.now();

  const { input, instructions, model, jsonOutput, responseParams, zodSchema } =
    parameters;
  const chosen_model = model || DEFAULT_MODEL;
  const includeJsonOutput = jsonOutput || false;

  if (!OPEN_AI_KEY || !OPEN_AI_KEY.startsWith("sk")) {
    throw Error("OPEN_AI_KEY is either not defined or is invalid.");
  }

  const client = new OpenAI({
    apiKey: OPEN_AI_KEY,
  });

  let response = null;

  const run = async () => {
    while (attempts < 3) {
      attempts++;
      try {
        response = await client.responses.create({
          model: chosen_model,
          instructions,
          input,
          ...responseParams,
        });

        json = parseOpenAIResponse(zodSchema, response);

        break;
      } catch (error) {
        if (error instanceof Error)
          logger.error({
            errorName: error.name,
            errorMessage: error.message,
            attempts,
            model: chosen_model,
            prompt: createMd5(instructions),
          });
        await delay(2000 * attempts);
        await run();
      }
    }
  };

  await run();

  if (response == null) {
    throw Error("OpenAI call failed.");
  }

  const endedAt = Date.now();
  let output: AiResponse = {
    response,
    model: chosen_model,
    success: true,
    attempts,
  };

  if (includeJsonOutput && zodSchema == null) {
    output.json = parseToJson(response);
  } else if (zodSchema) {
    output.json = json;
  }

  logger.info({
    name: "OpenAI Call",
    traceId: getTraceId(),
    attempts,
    startedAt,
    endedAt,
    duration: endedAt - startedAt,
    model: chosen_model,
    prompt: createMd5(instructions),
  });

  return output;
};

const parseToJson = (response: OpenAI.Responses.Response) => {
  const text = response.output_text;
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(
      `Failed to parse json from open AI response output: ${text}`
    );
  }
};

function parseOpenAIResponse(zodSchema: ZodTypeAny, response: any) {
  if (!zodSchema || !response) return null;

  const jsonData = parseToJson(response);

  const result = zodSchema.safeParse(jsonData);

  if (result.success) {
    return result.data;
  } else {
    throw new Error("Failed zod validation");
  }
}
