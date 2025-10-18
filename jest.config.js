// jest.config.ts
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jest-environment-node", // or 'jsdom' if needed
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transformIgnorePatterns: [
    "/node_modules/(?!(bson|mongodb|mongoose|@?next)/)",
  ],
};

export default createJestConfig(customJestConfig);
