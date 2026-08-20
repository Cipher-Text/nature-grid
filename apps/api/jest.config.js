/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  // tsconfig.base.json path aliases — ts-jest does not read them itself.
  moduleNameMapper: {
    '^@nature-grid/shared$': '<rootDir>/../../../packages/shared/src/index.ts',
    '^@nature-grid/contracts$': '<rootDir>/../../../packages/contracts/src/index.ts',
  },
  clearMocks: true,
  collectCoverageFrom: ['**/*.ts', '!**/*.module.ts', '!main.ts'],
};
