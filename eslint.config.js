import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default tseslint.config([
  {
    ignores: [
      'dist/**',
      'templates/**',
      'node_modules/**',
      '*.config.*',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      // Type-aware TypeScript rules for production apps
      ...tseslint.configs.recommendedTypeChecked,
      // Stricter rules for better code quality  
      ...tseslint.configs.strictTypeChecked,
      // Stylistic TypeScript rules
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      // React Hooks rules
      ...reactHooks.configs['recommended-latest'].rules,
      
      // React Refresh rules
      'react-refresh/only-export-components': ['warn', { 
        allowConstantExport: true 
      }],
      
      // Essential Accessibility rules for mobile-first development
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn', // Warning for mobile-first
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      
      // TypeScript rules - balanced for productivity and safety
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn', // Warning instead of error
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/restrict-template-expressions': 'off', // Too restrictive
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      '@typescript-eslint/no-confusing-void-expression': 'off', // Too restrictive for React
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      
      // Performance considerations
      'react-hooks/exhaustive-deps': 'error',
      
      // Code quality
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  // Separate config for component files with stricter rules
  {
    files: ['src/components/**/*.tsx'],
    rules: {
      // Component-specific rules - relaxed for now
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
    },
  },
  // Config for hooks
  {
    files: ['src/hooks/**/*.{ts,tsx}'],
    rules: {
      // Custom hook specific rules
      '@typescript-eslint/explicit-function-return-type': 'warn',
    },
  },
])
