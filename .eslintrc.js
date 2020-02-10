module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint", "prettier"],
  env: {
    es6: true,
  },
  rules: {
    "prettier/prettier": "error",
  },
  overrides: [
    {
      files: ["client/**/*"],
      env: {
        browser: true,
      },
    },
    {
      files: ["*.config.*", "server/**/*", "build/**/*"],
      env: {
        node: true,
      },
    },
  ],
};
