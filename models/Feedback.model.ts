import mongoose, { Schema, models } from "mongoose";

const FeedbackSchema = new Schema(
  {
    email: {
      type: String,
      required: false,
      maxLength: 254,
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    aiAnalytics: {
      type: Object,
      summary: {
        type: String,
      },
      sentiment: {
        type: String,
        enum: ["positive", "negative", "neutral"],
      },
      tags: {
        type: Array<string>,
      },
      priority: {
        type: Number,
        min: 0,
        max: 3,
      },
      nextAction: {
        type: String,
      },
      model: {
        type: String,
      },
    },
  },
  {
    collection: "feedback",
  }
);

export const FeedbackModel =
  models.Feedback || mongoose.model("Feedback", FeedbackSchema);
