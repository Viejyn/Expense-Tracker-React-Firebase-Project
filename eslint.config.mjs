import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // React 17+ için gerekli
      "@typescript-eslint/no-explicit-any": "warn", // 'any' kullanımına karşı uyarı
      "@typescript-eslint/no-unused-vars": ['error', { 'argsIgnorePattern': '^_' }], // Kullanılmayan değişkenler için uyarı
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: '18',
      },
    },
  },
];