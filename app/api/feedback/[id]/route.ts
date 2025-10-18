import { requestWrapper } from "@/lib/wrappers/request";
import { FeedbackModel } from "@/models/Feedback.model";

export const GET = requestWrapper(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const feedbackDocument = await FeedbackModel.findById(id);
    if (!feedbackDocument) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json(feedbackDocument);
  }
);
