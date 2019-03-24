# ESLint Plugin: proper-ternary

[![Build Status](https://travis-ci.org/getify/eslint-plugin-proper-ternary.svg?branch=master)](https://travis-ci.org/getify/eslint-plugin-proper-ternary)
[![npm Module](https://badge.fury.io/js/%40getify%2Feslint-plugin-proper-ternary.svg)](https://www.npmjs.org/package/@getify/eslint-plugin-proper-ternary)
[![Dependencies](https://david-dm.org/getify/eslint-plugin-proper-ternary.svg)](https://david-dm.org/getify/eslint-plugin-proper-ternary)
[![devDependencies](https://david-dm.org/getify/eslint-plugin-proper-ternary/dev-status.svg)](https://david-dm.org/getify/eslint-plugin-proper-ternary?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/getify/eslint-plugin-proper-ternary/badge.svg?branch=master)](https://coveralls.io/github/getify/eslint-plugin-proper-ternary?branch=master)

## Overview

The **proper-ternary** ESLint plugin provides rules that control the definitions of `? :` conditional expressions (aka, "ternary expressions"), restricting them to a narrower and more proper/readable form.

The rules defined in this plugin:

* [`"location"`](#rule-location): controls where a `? :` ternary expression can appear in program structure.

* [`"nested"`](#rule-nested): controls the nesting of `? :` ternary expressions.

## Enabling The Plugin

To use **proper-ternary**, load it as a plugin into ESLint and configure the rules as desired.

### `.eslintrc.json`

To load the plugin and enable its rules via a local or global `.eslintrc.json` configuration file:

```json
"plugins": [
    "@getify/proper-ternary"
],
"rules": {
    "@getify/proper-ternary/nested": "error"
}
```

### `package.json`

To load the plugin and enable its rules via a project's `package.json`:

```json
"eslintConfig": {
    "plugins": [
        "@getify/proper-ternary"
    ],
    "rules": {
        "@getify/proper-ternary/nested": "error"
    }
}
```

### ESLint CLI parameters

To load the plugin and enable its rules via ESLint CLI parameters, use `--plugin` and `--rule` flags:

```cmd
eslint .. --plugin='@getify/proper-ternary' --rule='@getify/proper-ternary/nested: error' ..
```

### ESLint Node API

To use this plugin in Node.js with the ESLint API, require the npm module, and then (for example) pass the rule's definition to `Linter#defineRule(..)`, similar to:

```js
var properTernary = require("@getify/eslint-plugin-proper-ternary");

// ..

var eslinter = new (require("eslint").Linter)();

eslinter.defineRule("@getify/proper-ternary/nested",properTernary.rules.nested);
```

Then lint some code like this:

```js
eslinter.verify(".. some code ..",{
    rules: {
        "@getify/proper-ternary/nested": "error"
    }
});
```

### Inline Comments

Once the plugin is loaded, the rule can be configured using inline code comments if desired, such as:

```js
/* eslint "@getify/proper-ternary/nested": "error" */
```

## Rule: `"nested"`

The **proper-ternary**/*nested* rule controls the nesting of `? :` ternary expressions.

To turn this rule on:

```json
"@getify/proper-ternary/nested": "error"
```

The main purpose of this rule is to avoid readability harm for `? :` ternary expressions with confusing nesting.

By forbidding nesting, the reader can clearly understand what the ternary will result in.

For example:

```js
// TODO
```

TODO. Therefore, the **proper-ternary**/*nested* rule would not report any errors.

By contrast, this rule *would* report errors for:

```js
// TODO
```

TODO

### Rule Configuration

The **proper-ternary**/*nested* rule can be configured with various combinations of these modes:

* [`"test"`](#rule-nested-configuration-clauses) (default: `false`) allows a ternary expression nested in the "test" clause of another ternary expression.

* [`"then"`](#rule-nested-configuration-clauses) (default: `false`) allows a ternary expression nested in the "then" (aka, "consequent") clause of another ternary expression.

* [`"else"`](#rule-nested-configuration-clauses) (default: `false`) allows a ternary expression nested in the "else" (aka, "alternate") clause of another ternary expression.

* [`"parens"`](#rule-nested-configuration-parens) (default: `true`) requires a nested ternary expression

* [`"depth"`](#rule-nested-configuration-depth) (default: `1`) controls how many levels of nesting are allowed. To use this option, you must also enable at least one of the `"test"` / `"then"` / `"else"` clause modes.

#### Rule `"nested"` Configuration: Clauses

To configure the `"test"`, `"then"`, and `"else"` rule modes (each default: `false`):

```json
"@getify/proper-ternary/nested": [ "error", { "test": true, "then": true, "else": true }
```

TODO

For example:

```js
// TODO
```

TODO

By contrast, this rule *would* report errors for:

```js
// TODO
```

TODO

#### Rule `"nested"` Configuration: `"parens"`

To configure this rule mode (default: `true`):

```json
"@getify/proper-ternary/nested": [ "error", { "parens": true } ]
```

TODO

For example:

```js
// TODO
```

TODO

By contrast, this rule *would* report errors for:

```js
// TODO
```

TODO

#### Rule `"nested"` Configuration: `"depth"`

To configure this rule mode (default: `1`):

```json
"@getify/proper-ternary/nested": [ "error", { "depth": 3 } ]
```

TODO

For example:

```js
// TODO
```

TODO

By contrast, this rule *would* report errors for:

```js
// TODO
```

TODO

## npm Package

To use this plugin with a global install of ESLint (recommended):

```cmd
npm install -g @getify/eslint-plugin-proper-ternary
```

To use this plugin with a local install of ESLint:

```cmd
npm install @getify/eslint-plugin-proper-ternary
```

## Builds

[![Build Status](https://travis-ci.org/getify/eslint-plugin-proper-ternary.svg?branch=master)](https://travis-ci.org/getify/eslint-plugin-proper-ternary)
[![npm Module](https://badge.fury.io/js/%40getify%2Feslint-plugin-proper-ternary.svg)](https://www.npmjs.org/package/@getify/eslint-plugin-proper-ternary)

If you need to bundle/distribute this eslint plugin, use `dist/eslint-plugin-proper-ternary.js`, which comes pre-built with the npm package distribution; you shouldn't need to rebuild it under normal circumstances.

However, if you download this repository via Git:

1. The included build utility (`scripts/build-core.js`) builds (and minifies) `dist/eslint-plugin-proper-ternary.js` from source.

2. To install the build and test dependencies, run `npm install` from the project root directory.

3. To manually run the build utility with npm:

    ```cmd
    npm run build
    ```

4. To run the build utility directly without npm:

    ```cmd
    node scripts/build-core.js
    ```

## Tests

A comprehensive test suite is included in this repository, as well as the npm package distribution. The default test behavior runs the test suite against `lib/index.js`.

1. The included Node.js test utility (`scripts/node-tests.js`) runs the test suite.

2. Ensure the test dependencies are installed by running `npm install` from the project root directory.

    - **Note:** Starting with npm v5, the test utility is **not** run automatically during this `npm install`. With npm v4 and before, the test utility automatically runs at this point.

3. To run the test utility with npm:

    ```cmd
    npm test
    ```

    Other npm test scripts:

    * `npm run test:dist` will run the test suite against `dist/eslint-plugins-proper-ternary.js` instead of the default of `lib/index.js`.

    * `npm run test:package` will run the test suite as if the package had just been installed via npm. This ensures `package.json`:`main` properly references `dist/eslint-plugins-proper-ternary.js` for inclusion.

    * `npm run test:all` will run all three modes of the test suite.

4. To run the test utility directly without npm:

    ```cmd
    node scripts/node-tests.js
    ```

### Test Coverage

[![Coverage Status](https://coveralls.io/repos/github/getify/eslint-plugin-proper-ternary/badge.svg?branch=master)](https://coveralls.io/github/getify/eslint-plugin-proper-ternary?branch=master)

If you have [Istanbul](https://github.com/gotwarlost/istanbul) already installed on your system (requires v1.0+), you can use it to check the test coverage:

```cmd
npm run coverage
```

Then open up `coverage/lcov-report/index.html` in a browser to view the report.

To run Istanbul directly without npm:

```cmd
istanbul cover scripts/node-tests.js
```

**Note:** The npm script `coverage:report` is only intended for use by project maintainers; it sends coverage reports to [Coveralls](https://coveralls.io/).

## License

All code and documentation are (c) 2019 Kyle Simpson and released under the [MIT License](http://getify.mit-license.org/). A copy of the MIT License [is also included](LICENSE.txt).
