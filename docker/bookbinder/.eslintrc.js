module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest', // revisit?
  },
  overrides: [
    {
      files: ['**/*.ts'],
      extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
      ],
      rules: {
        /* typescript-specific rules go here */
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': [
          'error',
          { typedefs: false },
        ],
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'error',
        indent: 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        // these two rules are b/c in TS, `let foo: T` doesn't widen `foo` to `T | undefined`
        'no-undef-init': 'off',
        'init-declarations': ['error', 'always'],
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
      plugins: ['@typescript-eslint'],
      settings: {
        'import/resolver': {
          typescript: {},
        },
      },
    },
    {
      files: ['*.mdx'],
      extends: [
        'plugin:mdx/recommended',
        'plugin:react/recommended',
        'prettier',
      ],
    },
  ],
  extends: ['airbnb-base', 'prettier'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    COMPONENTS: true,
    preval: true,
  },
  rules: {
    'no-restricted-syntax': 'off',
    'no-continue': 'off',
    'no-multiple-empty-lines': 'off',
    'arrow-parens': 'off',
    'no-console': 'off',
    'no-restricted-globals': 'off',
    'one-var-declaration-per-line': 'off',
    'one-var': 'off',
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
    'prefer-template': 'off',
    'no-multi-str': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'object-curly-newline': 'off',
    'no-underscore-dangle': 'off',
    'arrow-body-style': 'off',
    'import/no-absolute-path': 'off',
    'no-cond-assign': ['error', 'except-parens'],
    'no-empty': ['error', { allowEmptyCatch: true }],
  },
};
