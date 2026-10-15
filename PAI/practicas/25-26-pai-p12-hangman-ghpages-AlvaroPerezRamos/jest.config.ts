import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // Ya estamos en la raíz, así que rootDir es el punto actual
  rootDir: '.',

  testMatch: [
    '<rootDir>/src/exercises/home-work/test/**/*.test.ts',
  ],

  transform: {
    // Esto asegura que use ts-jest para todos los archivos .ts
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },

  moduleNameMapper: {
    // Maneja los imports que terminan en .js convirtiéndolos para que Jest los entienda
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  collectCoverageFrom: [
    'src/exercises/home-work/hangman/**/*.ts',
    '!src/exercises/home-work/test/**/*.test.ts',
  ],
};

export default config;
