import jsdoc from "eslint-plugin-jsdoc";
import prettier from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import playwrightPlugin from "eslint-plugin-playwright";

export default [
  {
    languageOptions: {
      globals: {
        node: true,
        browser: true,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 2023,
      sourceType: 'module',
    },
    settings: {
      "import/resolver": {
        typescript: {
          typescript: true,
          node: true,
          alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        },
      },
    },
    files: ["src/**/*.ts"],
    // plugins: ['@typescript-eslint', 'prettier', 'import', 'jsdoc'],
    plugins: {
      eslint: tseslint.configs.eslintRecommended,
      "@typescript-eslint": tseslint.configs.recommended,
      jsdoc: jsdoc,
      prettier: prettier,
      import: importPlugin,
      importTypescript: importPlugin.configs.typescript,
      playwright: playwrightPlugin,
    },
    rules: {
      // Prettier Rules
      "prettier/prettier": "error",
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],

      // TypeScript Rules
      "@typescript-eslint/no-unsafe-assignment": "off", // Consider revisiting this setting later to change it to either 'warn' or 'error'.
      "@typescript-eslint/no-unsafe-member-access": "off", // Consider revisiting this setting later to change it to either 'warn' or 'error'.
      "@typescript-eslint/no-unsafe-return": "off",
      // '@typescript-eslint/no-floating-promises': 'error',
      // '@typescript-eslint/no-unnecessary-type-assertion': 'error',

      // Import Rules
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/no-absolute-path": "error",
      "import/no-self-import": "error",
      "sort-imports": [
        "error",
        {
          ignoreDeclarationSort: true,
        },
      ],

      // General Rules
      "require-await": "off",
      complexity: ["warn", { max: 16 }],

      // JSDoc Rules
      "jsdoc/check-alignment": "warn",
      "jsdoc/check-indentation": "warn",

      // Playwright Rules
      "playwright/missing-playwright-await": ["error"],
      "playwright/no-focused-test": "error",
      "playwright/valid-expect": "error",
      "playwright/prefer-web-first-assertions": "error",
      "playwright/no-useless-await": "error",
      "playwright/no-page-pause": "error",
      "playwright/no-element-handle": "error",
      "playwright/no-eval": "error",
      "playwright/prefer-to-be": "error",
      "playwright/prefer-to-contain": "error",
      "playwright/prefer-to-have-length": "error",
      "playwright/no-wait-for-timeout": "warn",
      "playwright/no-useless-not": "warn",
      "playwright/require-top-level-describe": "off",
      "playwright/expect-expect": "off",
      "playwright/no-conditional-in-test": "off",
      "playwright/no-skipped-test": "off",
    },
    ignores: ["**/temp.js", "config/*"],
  },
];
