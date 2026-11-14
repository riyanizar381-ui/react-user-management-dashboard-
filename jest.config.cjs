
module.exports = {
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],

  setupFiles: ['<rootDir>/jest.setup.cjs'],

  setupFilesAfterEnv: ['@testing-library/jest-dom'],

  testMatch: [
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],

  maxWorkers: 1,
};
