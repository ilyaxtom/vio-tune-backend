// @ts-check
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";

export default tseslint.config(
  {
    ignores: ["eslint.config.mjs"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  importPlugin.flatConfigs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: "commonjs",
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "simple-import-sort": eslintPluginSimpleImportSort,
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unsafe-call": "off",
      "import/no-unresolved": "off",
      "import/default": "off",
      "import/named": "off",
      "import/namespace": [
        "error",
        {
          allowComputed: true,
        },
      ],
      "import/prefer-default-export": "off",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [["^@", "^[^/]+$"], ["^[^@./][^/]*/.+$"], ["^[./]"]],
        },
      ],
      "simple-import-sort/exports": "error",
      "import/no-named-as-default-member": "off",
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
);
