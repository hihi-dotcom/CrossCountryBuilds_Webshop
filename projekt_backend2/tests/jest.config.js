module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/api/**/*.test.js'],
  collectCoverageFrom: ['**/api/**/*.js'],
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 30000,
  setupFilesAfterEnv: ['dotenv/config'],
  forceExit: true
};