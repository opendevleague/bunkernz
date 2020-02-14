module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
    },
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    plugins: ["@typescript-eslint"],
    env: {
        es6: true,
    },
    overrides: [
        {
            files: ["client/**/*", "shared/**/*"],
            env: {
                browser: true,
            },
            rules: {
                "no-dupe-class-members": "off"
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
