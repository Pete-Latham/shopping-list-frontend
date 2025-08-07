// Project-specific ESLint rules to enforce development standards

module.exports = {
  extends: [
    './eslint.config.js' // Extend your existing config
  ],
  rules: {
    // Enforce consistent component structure
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function'
      }
    ],
    
    // Encourage proper TypeScript usage
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-implicit-any': 'error',
    
    // Accessibility requirements
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/no-noninteractive-element-interactions': 'error',
    'jsx-a11y/interactive-supports-focus': 'error',
    
    // Performance considerations
    'react-hooks/exhaustive-deps': 'error',
    'react/jsx-no-bind': ['error', { 
      'ignoreRefs': true, 
      'allowArrowFunctions': true 
    }],
    
    // Consistency rules
    'import/order': ['error', {
      'groups': [
        'builtin',
        'external', 
        'internal',
        'parent',
        'sibling',
        'index'
      ],
      'newlines-between': 'never'
    }]
  },
  
  // Custom rules for project standards
  overrides: [
    {
      files: ['**/*.module.css'],
      rules: {
        // CSS Modules specific rules could go here
        // (requires custom ESLint plugin for CSS)
      }
    },
    {
      files: ['src/components/**/*.tsx'],
      rules: {
        // Component-specific rules
        'react/prop-types': 'off', // Using TypeScript interfaces instead
        '@typescript-eslint/explicit-module-boundary-types': 'error'
      }
    }
  ]
};
