module.exports = {
  root: true,
  "env": {
      "browser": true,
      "node": true
  },
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: {
        project: [
          "tsconfig.json",
        ],
        createDefaultProgram: true
      },
      extends: [
        "plugin:@angular-eslint/recommended",
        'plugin:prettier/recommended'
      ],
      rules: {
        "@angular-eslint/no-input-rename": "off",
        "@angular-eslint/no-output-rename": "off",
        "comma-dangle": ["error", {
          "arrays": "never",
          "objects": "never",
          "imports": "never",
          "exports": "never",
          "functions": "never"
      }]
      }
    },
   /* {
      files: ["*.component.html"],
      extends: ["plugin:@angular-eslint/template/recommended"],
    },*/
    {
      files: ["*.component.ts"],
      extends: ["plugin:@angular-eslint/template/process-inline-templates"]
    }
  ],
  "ignorePatterns": [
      "projects/**/*"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
      "project": "tsconfig.json",
      "sourceType": "module"
  },
  "plugins": [
      "@angular-eslint/eslint-plugin",
      "unused-imports"
  ],
  "rules": {
      "@angular-eslint/component-class-suffix": "error",
      "@angular-eslint/component-selector": "off",
      "@angular-eslint/directive-class-suffix": "error",
      "@angular-eslint/directive-selector": "off",
      "@angular-eslint/no-input-rename": "off",
      "@angular-eslint/no-output-rename": "off",
      "@angular-eslint/use-pipe-transform-interface": "error",
      "@typescript-eslint/dot-notation": "off",
      "@typescript-eslint/explicit-member-accessibility": [
          "off",
          {
              "accessibility": "explicit"
          }
      ],
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/unified-signatures": "off",
      "arrow-body-style": "error",
      "brace-style": [
          "error",
          "1tbs"
      ],
      "constructor-super": "error",
      "curly": "error",
      "eol-last": ["error", "never"],
      "eqeqeq": [
          "error",
          "smart"
      ],
      "guard-for-in": "error",
      "id-blacklist": "off",
      "id-match": "off",
      "max-len": [
          "error",
          {
              "code": 100
          }
      ],
      "no-bitwise": "error",
      "no-caller": "error",
      "no-console": [
          "error",
          {
              "allow": [
                  "log",
                  "warn",
                  "dir",
                  "timeLog",
                  "assert",
                  "clear",
                  "count",
                  "countReset",
                  "group",
                  "groupEnd",
                  "table",
                  "debug",
                  "dirxml",
                  "error",
                  "groupCollapsed",
                  "Console",
                  "profile",
                  "profileEnd",
                  "timeStamp",
                  "context"
              ]
          }
      ],
      "no-debugger": "error",
      "no-empty": "off",
      "no-eval": "error",
      "no-fallthrough": "error",
      "no-new-wrappers": "error",
      "no-restricted-imports": [
          "error",
          "rxjs/Rx"
      ],
      "no-shadow": "off",
      "no-throw-literal": "error",
      "no-trailing-spaces": "error",
      "no-undef-init": "error",
      "no-underscore-dangle": "off",
      "no-unused-labels": "error",
      "no-var": "error",
      "prefer-const": "off",
      "radix": "error",
      "spaced-comment": [
          "error",
          "always",
          {
              "markers": [
                  "/"
              ]
          }
      ],
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
      ]
  }
};
