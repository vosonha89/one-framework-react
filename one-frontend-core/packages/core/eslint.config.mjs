import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// Flat config for the framework-agnostic core (relaxed upstream conventions).
// `.mjs` because the package publishes CommonJS (no `type: module`).
export default tseslint.config(
  {
    ignores: ['lib/', 'node_modules/'],
  },
  {
    files: ['src/**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // Core keeps `any` only in abstractType (scoped disable); `const me = this` idiom.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-this-alias': [
        'error',
        { allowDestructuring: true, allowedNames: ['me'] },
      ],
    },
  },
)