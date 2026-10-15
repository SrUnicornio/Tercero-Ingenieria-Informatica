// eslint.config.mjs

import globals from 'globals';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

const compat = new FlatCompat();

export default [
  /**
   * Base configuration (JavaScript / Node)
   */
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  // ESLint recommended rules for JavaScript
  js.configs.recommended,

  // Google JavaScript Style Guide
  ...compat.extends('google'),

  /**
   * TypeScript configuration
   */
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
      globals: globals.node,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      /**
       * Disable JS rules that conflict with TypeScript
       */
      'no-unused-vars': 'off',
      'no-undef': 'off',

      /**
       * Enable TypeScript-aware rules
       */
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
        },
      ],

      /**
       * Documentation rules
       * (JSDoc is checked by TypeScript + TypeDoc, not ESLint)
       */
      'require-jsdoc': 'off',
      'valid-jsdoc': 'off',
    },
  },
];
