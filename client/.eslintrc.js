module.exports = {
  env: {
    "browser": true,
    "es6": true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  globals: {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  plugins: [
    '@typescript-eslint'
  ],
  parser: '@typescript-eslint/parser',
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  }, rules: {
    'no-console': 0,
    'arrow-body-style': 1,
    'no-unused-vars': 1,
    'linebreak-style': 0,
    'max-len': 0,
    'import/prefer-default-export': 0,
    'comma-dangle': ['warn', 'only-multiline'],
    'semi': ["error", "always"],
    'quotes': ['warn', 'double'],
  },
  // Solves import issues
  settings: {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  }
};