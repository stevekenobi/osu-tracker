/** @type {require('jest').Config} */
const config = {
  verbose: true,
  setupFiles: ['./tests/setup.js'],
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/**/*.{js,jsx}']
};

module.exports = config;
