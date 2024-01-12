// jest.config.ts

export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    // Remove the '^.+\\.jsx?$': 'babel-jest' line
  },
  rootDir: './',
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': './fileMock.js',
    '^@app/(.*)$': './$1',
    "^canisters/(.*)": "./.dfx/local/canisters/$1",
  },
  setupFiles: ['./jest.setup.js', "./src/frontend/tests/React/mockEventTarget.js"],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  extensionsToTreatAsEsm: ['.ts'],
};
