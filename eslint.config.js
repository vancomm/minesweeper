// @ts-check
import path from 'path'
import { fileURLToPath } from 'url'

import globals from 'globals'
import eslintjs from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import prettier from 'eslint-config-prettier'
import { FlatCompat } from '@eslint/eslintrc'
import reactCompiler from 'eslint-plugin-react-compiler'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

export default tseslint.config(
    {
        files: ['src/*.{ts,tsx}'],
        ...eslintjs.configs.recommended,
    },
    ...tseslint.configs.recommendedTypeChecked.map((config) => ({
        ...{
            ...config,
            files: ['src/*.{ts,tsx}'],
            // ignores: ['eslint.config.js'],
            languageOptions: {
                ...config.languageOptions,
                parserOptions: {
                    ...config.languageOptions?.parserOptions,
                    project: ['./tsconfig.json', './tsconfig.node.json'],
                },
            },
        },
    })),
    react.configs.flat['jsx-runtime'],
    prettier,
    {
        files: ['src/*.{ts,tsx}'],
        ignores: ['eslint.config.js'],
        plugins: { 'react-compiler': reactCompiler },
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                project: ['./tsconfig.json', './tsconfig.node.json'],
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/only-throw-error': 'off',
        },
    }
)
