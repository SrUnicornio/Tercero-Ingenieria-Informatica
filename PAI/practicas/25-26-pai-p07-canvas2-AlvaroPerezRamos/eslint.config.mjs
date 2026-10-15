import globals from 'globals';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const compat = new FlatCompat();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  // Reglas base de JS
  js.configs.recommended,

  // Google JavaScript Style Guide
  ...compat.extends('google'),

  // Archivos TypeScript
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Desactivar reglas JS que chocan con TS
      'no-unused-vars': 'off',
      'no-undef': 'off',

      // Activar equivalentes TS
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        { allowExpressions: true },
      ],

      // JSDoc lo gestiona TypeDoc
      'require-jsdoc': 'off',
      'valid-jsdoc': 'off',

      // Permitir documentación larga
      'max-len': [
        'error',
        {
          code: 80,
          ignoreComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
    },
  },

  // Archivos JS para navegador
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
];