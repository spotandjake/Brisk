/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: ['<rootDir>/Tests'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
  extensionsToTreatAsEsm : [ '.js', '.jsx', '.ts', '.tsx' ],
  testEnvironment: 'node',
};