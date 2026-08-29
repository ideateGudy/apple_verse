import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactCompiler from 'eslint-plugin-react-compiler'
import reactThree from '@react-three/eslint-plugin'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),

  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,

      // React
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],

      // React Hooks
      reactHooks.configs.flat.recommended,

      // Vite / Fast Refresh
      reactRefresh.configs.vite,

      // React Compiler
      reactCompiler.configs.recommended,
    ],

    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-compiler': reactCompiler,
      'react-three': reactThree,
    },

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'react/jsx-no-target-blank': 'off',

      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],

      // React Compiler
      'react-compiler/react-compiler': 'error',
    },
  },
])
