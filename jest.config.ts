import type { Config } from "jest";
import nextJest from "next/jest.js";

// Projections and month keys use local dates, so pin the timezone for stable results
process.env.TZ = "America/Sao_Paulo";

const createJestConfig = nextJest({
  // Loads next.config.ts and .env files into the test environment
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
};

// Exported this way so next/jest can load the async Next.js config
export default createJestConfig(config);
