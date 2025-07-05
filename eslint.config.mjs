import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import playwrightPlugin from "eslint-plugin-playwright";
import prettierPlugin from "eslint-plugin-prettier";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import unicornPlugin from "eslint-plugin-unicorn";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { globalIgnores } from "eslint/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  globalIgnores(["node_modules/", ".next/", "dist/", "build/"]),

  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    ignores: ["node_modules", ".next", "dist", "build"],

    plugins: {
      unicorn: unicornPlugin,
      import: importPlugin,
      playwright: playwrightPlugin,
      prettier: prettierPlugin,
      "simple-import-sort": simpleImportSortPlugin,
    },
    rules: {
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": "error",
      "unicorn/no-array-callback-reference": "off",
      "unicorn/no-array-for-each": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/prevent-abbreviations": "off",

      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
];
