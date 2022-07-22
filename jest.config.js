/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

export default {
    preset: "ts-jest",
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".jsx"],
    globals: {
      "ts-jest": {
        useESM: true,
      },
    },
    moduleNameMapper: {
      "^(\\.{1,2}/.*)\\.ts$": "$1",
    },
};