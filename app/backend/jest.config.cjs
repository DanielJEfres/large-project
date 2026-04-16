/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/tests/**/*.test.ts'],
  setupFiles: ['<rootDir>/tests/jest.setup.ts'],
  testTimeout: 120000,
  extensionsToTreatAsEsm: ['.ts'],
  collectCoverageFrom: [
    '<rootDir>/app.js',
    '<rootDir>/models/User.js',
    '<rootDir>/models/RefreshTokens.js',
    '<rootDir>/routes/auth.js',
  ],
}
