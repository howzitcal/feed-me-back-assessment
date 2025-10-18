import { Badge, Box } from "@chakra-ui/react";
import React from "react";

interface TagsProps {
  items: String[];
}

const Tags: React.FC<TagsProps> = ({ items }) => {
  return (
    <>
      {items.map((tag, index) => (
        <Badge key={index} variant="solid" colorPalette="blue" m={0.5}>
          {tag}
        </Badge>
      ))}
    </>
  );
};

export default Tags;
