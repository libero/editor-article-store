const tsPreset = require('ts-jest/jest-preset');
const mongoPreset = require('@shelf/jest-mongodb/jest-preset');

module.exports = {
  ...tsPreset,
  ...mongoPreset,
  "collectCoverage": true,
  "coverageDirectory": "./test/report",
  "coverageThreshold": {
      "global": {
          "branches": 80,
          "functions": 80,
          "lines": 80,
          "statements": 0
      }
  },
  "transform": {
    "^.+\\.(t|j)sx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"]
}