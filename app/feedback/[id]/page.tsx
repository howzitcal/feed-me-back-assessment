"use client";

import SentimentBadge from "@/components/app/SentimentBadge";
import SimplePage from "@/components/app/SimplePage";
import Tags from "@/components/app/Tags";
import { Box, Button, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { use, useEffect, useState } from "react";

import Link from "next/link";

interface FeedbackAIAnalytics {
  sentiment: string;
  summary: string;
  tags: String[];
  priority: number;
  nextAction: string;
  model: string;
}

interface FeedbackDocument {
  aiAnalytics: FeedbackAIAnalytics;
  createdAt: Date;
  text: string;
}

interface FeedbackPageProps {
  params: Promise<{ id: string }>;
}

const FeedbackListPage: React.FC<FeedbackPageProps> = ({
  params,
}: FeedbackPageProps) => {
  const [feedbackData, setFeedbackData] = useState<FeedbackDocument | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = use(params);

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`/api/feedback/${id}`);
      const feedbackJson = await res.json();
      console.log(feedbackJson);
      setFeedbackData(feedbackJson || {});
    } catch (e) {
      console.error(e);
      setError("Failed to fetch feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchFeedback();
    })();
  }, []);

  if (loading) return <Center>Loading...</Center>;
  if (error) return <Center color="red.500">{error}</Center>;

  return (
    <SimplePage>
      <Link href="/feedback">
        <Button variant={"outline"} mb={2}>
          Back
        </Button>
      </Link>
      <Flex gap={"5"} flexDir={"column"}>
        <Box>
          <Heading fontWeight="bold" size="lg">
            User Text:
          </Heading>
          <Text>{feedbackData?.text}</Text>
        </Box>

        <Box>
          <Heading fontWeight="bold" size="lg">
            Feedback CreatedAt:
          </Heading>
          <Text>{feedbackData?.createdAt}</Text>
        </Box>

        <Box>
          <Heading fontWeight="bold" size="lg">
            Summary:
          </Heading>
          <Text>{feedbackData?.aiAnalytics.summary}</Text>
        </Box>

        <Box>
          <Heading fontWeight="bold" size="lg">
            Next Action:
          </Heading>
          <Text>{feedbackData?.aiAnalytics.nextAction}</Text>
        </Box>

        <Box>
          <Heading fontWeight="bold" size="lg">
            Priority:
          </Heading>
          <Text>{feedbackData?.aiAnalytics.priority}</Text>
        </Box>

        <Box>
          <Heading fontWeight="bold" size="lg">
            Tags:
          </Heading>
          <Tags items={feedbackData?.aiAnalytics.tags || []} />
        </Box>

        <Box>
          <Heading fontWeight="bold" size="lg">
            Sentiment:
          </Heading>
          <SentimentBadge
            sentiment={feedbackData?.aiAnalytics.sentiment || ""}
          />
        </Box>

        <Box>
          <Heading fontWeight="bold" size="lg">
            AI Model Used:
          </Heading>
          <Text>{feedbackData?.aiAnalytics.model}</Text>
        </Box>
      </Flex>
    </SimplePage>
  );
};

export default FeedbackListPage;
