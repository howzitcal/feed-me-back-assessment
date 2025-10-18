import { Box } from "@chakra-ui/react";
import React from "react";

interface SentimentBadgeProps {
  sentiment: string;
}

const SentimentBadge: React.FC<SentimentBadgeProps> = ({ sentiment }) => {
  let sentimentColour;
  switch (sentiment) {
    case "positive":
      sentimentColour = "green.400";
      break;
    case "neutral":
      sentimentColour = "blue.400";
      break;
    case "negative":
      sentimentColour = "red.500";
      break;
  }
  return (
    <Box
      rounded="xl"
      textAlign="center"
      p={1}
      bg={sentimentColour}
      color="white"
    >
      {sentiment}
    </Box>
  );
};

export default SentimentBadge;
