import FeedbackSentimentAnalysis from "@/ai/FeedbackSentimentAnalysis.ai";
import { requestWrapper } from "@/lib/wrappers/request";
import { FeedbackModel } from "@/models/Feedback.model";
import { FeedbackSchema } from "@/schemas/Feedback.schema";
import { NextRequest, NextResponse } from "next/server";

export const GET = requestWrapper(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "5");
  const sortBy = searchParams.get("sortBy");
  const skip = (page - 1) * pageSize;

  const sortOptions: any = {};
  if (["sentiment", "priority", "tags"].includes(sortBy)) {
    sortOptions[`aiAnalytics.${sortBy}`] = 1;
  }

  const [records, total] = await Promise.all([
    FeedbackModel.find().sort(sortOptions).skip(skip).limit(pageSize).lean(),
    FeedbackModel.countDocuments(),
  ]);

  return NextResponse.json({
    records,
    page,
    pageSize,
    total,
  });
});

export const POST = requestWrapper(async (req: NextRequest) => {
  const jsonBody = await req.json();
  const newFeedbackPayload = FeedbackSchema.parse(jsonBody);

  const aiAnalytics = await FeedbackSentimentAnalysis(newFeedbackPayload.text);
  const createdFeedback = await FeedbackModel.create({
    ...newFeedbackPayload,
    aiAnalytics,
  });
  return NextResponse.json(createdFeedback, { status: 201 });
});
