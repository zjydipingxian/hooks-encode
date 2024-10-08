import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  { files: ['packages/hooks/**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // 声明的变量必须被使用
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          caughtErrors: 'all',
          ignoreRestSiblings: false,
          reportUsedIgnorePattern: false,
        },
      ],
      // 不要在声明前就使用变量
      'no-use-before-define': ['error', { functions: false, classes: false, variables: false }],
      // 禁止使用未声明的变量
      'no-undef': 'off',
      // 禁止使用 alert
      'no-alert': 'error',
      // 不要出现空代码块
      'no-empty': 'error',
      // 不要出现空函数
      'no-empty-function': [
        'error',
        {
          allow: ['arrowFunctions', 'functions', 'methods'],
        },
      ],
    },
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/public/**',
      '**/build/**',
      '**/coverage/**',
      '**/test/**',
      '**/tests/**',
      '**/__tests__/**',
      '**/__mocks__/**',
      '**/mock/**',
      '**/types/**',
    ],
  },
];
