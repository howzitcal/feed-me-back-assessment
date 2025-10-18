import { makeOpenAiRequest } from "@/lib/ai/OpenAIService";
import { z } from "zod";

jest.mock("openai", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      responses: {
        create: jest.fn().mockRejectedValue(new Error("Mock OpenAI failure")),
      },
    })),
  };
});

jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn(),
  },
}));

describe("makeOpenAiRequest (failure case)", () => {
  beforeEach(() => {
    process.env.OPEN_AI_KEY = "sk-fakekey";
  });

  it("should throw after retrying 3 times", async () => {
    const zodSchema = z.object({ message: z.string() });

    await expect(
      makeOpenAiRequest({
        input: "test",
        instructions: "cause error",
        zodSchema,
      })
    ).rejects.toThrow("OpenAI call failed.");
  });
});
