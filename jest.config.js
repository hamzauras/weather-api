module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  globalSetup: './tests/setup.ts',
  globalTeardown: './tests/teardown.ts',
};