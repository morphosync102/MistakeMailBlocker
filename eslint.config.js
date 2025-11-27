import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            // React Hooks ルール
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // TypeScript ルール
            '@typescript-eslint/no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            }],
            '@typescript-eslint/no-explicit-any': 'warn',

            // 一般的なルール
            'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
            'prefer-const': 'warn',
        },
    },
    {
        ignores: ['dist/', 'node_modules/', '*.config.js', '*.config.ts', 'scripts/'],
    }
);
