import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import jsdoc from 'eslint-plugin-jsdoc'
import boundaries from 'eslint-plugin-boundaries'

// Shared layer-boundary settings (core is the lowest layer).
const boundarySettings = {
  'import/resolver': {
    typescript: {
      alwaysTryTypes: true,
      project: './tsconfig.app.json',
    },
  },
  'boundaries/elements': [
    { type: 'core', pattern: 'src/core/**' },
    { type: 'common', pattern: 'src/common/**' },
    { type: 'services', pattern: 'src/services/**' },
    { type: 'types', pattern: 'src/types/**' },
    { type: 'views', pattern: 'src/views/**' },
    { type: 'root', pattern: 'src/*.{ts,tsx}' },
  ],
  'boundaries/ignore': ['**/*.d.ts'],
}

// Helpers for the boundaries v7 object-selector / policy syntax.
const fromType = (type) => ({ element: { type } })
const toTypes = (...types) => types.map((type) => ({ to: { element: { type } } }))

const boundaryRules = {
  'boundaries/dependencies': [
    'error',
    {
      default: 'disallow',
      policies: [
        { from: fromType('core'), allow: toTypes('core') },
        { from: fromType('common'), allow: toTypes('common', 'core') },
        { from: fromType('services'), allow: toTypes('common', 'services', 'types', 'core') },
        { from: fromType('types'), allow: toTypes('common', 'services', 'types', 'core') },
        { from: fromType('views'), allow: toTypes('common', 'services', 'types', 'views', 'core') },
        { from: fromType('root'), allow: toTypes('common', 'services', 'types', 'views', 'root', 'core') },
      ],
    },
  ],
}

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', 'templates'],
  },
  {
    // Application layers: strict type-checked OOP / JSDoc enforcement.
    files: ['**/*.{ts,tsx}'],
    ignores: ['src/core/**'],
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      ecmaVersion: 2021,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      jsdoc,
      boundaries,
    },
    settings: boundarySettings,
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react-hooks/exhaustive-deps': 'warn',

      // OOP / type-safety enforcement.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit' },
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      '@typescript-eslint/no-this-alias': [
        'error',
        { allowDestructuring: true, allowedNames: ['me'] },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
      // Framework contracts use sync-backed async services and single-use generics.
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',

      // JSDoc enforcement for public classes, methods and functions.
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            ClassDeclaration: true,
            MethodDefinition: true,
            FunctionDeclaration: true,
          },
        },
      ],
      'jsdoc/require-param': 'error',
      'jsdoc/require-returns': 'error',

      // Layer boundary enforcement.
      ...boundaryRules,
    },
  },
  {
    // Internal core library: vendored upstream code with its own conventions.
    // Non-type-checked recommended rules; layer boundaries still enforced.
    files: ['src/core/**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2021,
      globals: globals.browser,
    },
    plugins: { boundaries },
    settings: boundarySettings,
    rules: {
      ...boundaryRules,
      '@typescript-eslint/no-this-alias': [
        'error',
        { allowDestructuring: true, allowedNames: ['me'] },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['*.config.js', 'plopfile.mjs', 'scripts/**/*.mjs'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
  },
)