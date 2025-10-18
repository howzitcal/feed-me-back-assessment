import { Box, Center } from "@chakra-ui/react";
import React from "react";

interface PageProps {
  children: React.ReactNode;
}

const SimplePage: React.FC<PageProps> = ({ children }) => {
  return (
    <Center>
      <Box bg="gray.500" w="80%" mt={4} p="4" color="black" rounded="md">
        {children}
      </Box>
    </Center>
  );
};

export default SimplePage;
