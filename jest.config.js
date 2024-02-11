/** @type {require('jest').Config} */
const config = {
  verbose: true,
  setupFiles: ['./tests/setup.js'],
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageDirectory: '.coverage',
  collectCoverageFrom: [
    'src/client/**/*.{js,jsx}',
    'src/server/helpers/**/*.{js,jsx}',
    'src/utils/**/*.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

module.exports = config;
