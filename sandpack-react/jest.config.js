module.exports = {
  setupFilesAfterEnv: ["<rootDir>/src/setup.jest.ts"],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  globals: {
    "process.env.TEST_ENV": "true",
  },
};
