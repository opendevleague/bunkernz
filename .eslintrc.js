module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    SERVER_PORT: false,
  },
  overrides: [
    {
      files: ["*.config.*", "server/**/*"],
      env: {
        node: true,
      },
    },
  ],
};
