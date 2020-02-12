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
            files: ["client/**/*", "shared/**/*"],
            env: {
                browser: true,
            },
        },
        {
            files: [
                ".*rc.js",
                "*.config.*",
                "server/**/*",
                "build/**/*",
                "shared/**/*",
            ],
            env: {
                node: true,
            },
        },
    ],
};
