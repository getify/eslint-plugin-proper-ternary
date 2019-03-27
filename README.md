# ESLint Plugin: proper-ternary

[![Build Status](https://travis-ci.org/getify/eslint-plugin-proper-ternary.svg?branch=master)](https://travis-ci.org/getify/eslint-plugin-proper-ternary)
[![npm Module](https://badge.fury.io/js/%40getify%2Feslint-plugin-proper-ternary.svg)](https://www.npmjs.org/package/@getify/eslint-plugin-proper-ternary)
[![Dependencies](https://david-dm.org/getify/eslint-plugin-proper-ternary.svg)](https://david-dm.org/getify/eslint-plugin-proper-ternary)
[![devDependencies](https://david-dm.org/getify/eslint-plugin-proper-ternary/dev-status.svg)](https://david-dm.org/getify/eslint-plugin-proper-ternary?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/getify/eslint-plugin-proper-ternary/badge.svg?branch=master)](https://coveralls.io/github/getify/eslint-plugin-proper-ternary?branch=master)

## Overview

The **proper-ternary** ESLint plugin provides rules that control the definitions of `? :` conditional expressions (aka, "ternary expressions"), restricting them to a narrower and more proper/readable form.

The rules defined in this plugin:

* [`"nested"`](#rule-nested): controls the nesting of `? :` ternary expressions.

* [`"parens"`](#rule-parens): requires surrounding `( .. )` parentheses around specific kinds of expressions in ternary expression clauses.

* [`"where"`](#rule-where): restricts where in program structure ternary expressions can be used: forbidding them as standalone statements, in object properties, as arguments, etc.

## Enabling The Plugin

To use **proper-ternary**, load it as a plugin into ESLint and configure the rules as desired.

### `extends`

If you'd like to use the **proper-ternary** plugin in a recommended configuration preset, you can add the plugin in the `extends` clause of your ESLint configuration, and pick a preset by name:

```js
"extends": [
    // ..
    "plugin:@getify/proper-ternary/CONFIG-PRESET-NAME",
    // ..
]
```

**Note:** All included configuration presets not only define specific rule configurations but also automatically load the plugin itself, so you *don't* need to list **proper-ternary** in the `plugins` clause.

The available configuration presets to choose from:

* `getify-says`: This is my personal configuration. See the [preset definition](/lib/index.js#L5-L12).

* ..TBA..

It's important to note that you can still override any of the preset rule definitions in your configuration. Think of these presets as convenience "defaults" that can still be customized.

### `.eslintrc.json`

To load the plugin and enable its rules via a local or global `.eslintrc.json` configuration file:

```json
"plugins": [
    "@getify/proper-ternary"
],
"rules": {
    "@getify/proper-ternary/nested": "error",
    "@getify/proper-ternary/parens": "error",
    "@getify/proper-ternary/where": "error"
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
        "@getify/proper-ternary/nested": "error",
        "@getify/proper-ternary/parens": "error",
        "@getify/proper-ternary/where": "error"
    }
}
```

### ESLint CLI parameters

To load the plugin and enable its rules via ESLint CLI parameters, use `--plugin` and `--rule` flags:

```cmd
eslint .. --plugin='@getify/proper-ternary' --rule='@getify/proper-ternary/nested: error' ..
```

```cmd
eslint .. --plugin='@getify/proper-ternary' --rule='@getify/proper-ternary/parens: error' ..
```

```cmd
eslint .. --plugin='@getify/proper-ternary' --rule='@getify/proper-ternary/where: error' ..
```

### ESLint Node API

To use this plugin in Node.js with the ESLint API, require the npm module, and then (for example) pass the rule's definition to `Linter#defineRule(..)`, similar to:

```js
var properTernary = require("@getify/eslint-plugin-proper-ternary");

// ..

var eslinter = new (require("eslint").Linter)();

eslinter.defineRule("@getify/proper-ternary/nested",properTernary.rules.nested);

eslinter.defineRule("@getify/proper-ternary/parens",properTernary.rules.parens);

eslinter.defineRule("@getify/proper-ternary/where",properTernary.rules.where);
```

Then lint some code like this:

```js
eslinter.verify(".. some code ..",{
    rules: {
        "@getify/proper-ternary/nested": "error",
        "@getify/proper-ternary/parens": "error",
        "@getify/proper-ternary/where": "error"
    }
});
```

### Inline Comments

Once the plugin is loaded, the rule can be configured using inline code comments if desired, such as:

```js
/* eslint "@getify/proper-ternary/nested": "error" */
```

```js
/* eslint "@getify/proper-ternary/parens": "error" */
```

```js
/* eslint "@getify/proper-ternary/where": "error" */
```

## Rule: `"nested"`

The **proper-ternary**/*nested* rule controls the nesting of `? :` ternary expressions.

To turn this rule on:

```json
"@getify/proper-ternary/nested": "error"
```

The main purpose of this rule is to avoid readability harm for `? :` ternary expressions with confusing nesting of other ternary expressions. By forbidding confusing nesting, the reader can more clearly understand what the ternary will result in.

For example:

```js
var name = userData ? userData.name : "-empty-";
```

This ternary expression doesn't have any other ternary expression nested in it. It's much clearer to figure out what its behavior will be. Therefore, the **proper-ternary**/*nested* rule would not report any errors.

By default, ternary expression nesting is forbidden **in all three ternary expression clauses**, and nesting depth is furthermore limited to one level. As such, this rule *would* default to **reporting errors** for each of these statements:

```js
var name =
    (typeof isLoggedIn == "function" ? isLoggedIn() : false)
        ? userData.name
        : "-empty-";

var email =
    userData != null
        ? (userData.email != "" ? userData.email : "nobody@email.tld")
        : "-empty-";

var accountType =
    userData.type == 1 ? "admin" :
    userData.type == 2 ? "manager" :
    userData.type == 3 ? "vendor" :
    "customer";
```

The `name` assignment statement has a ternary expression nested inside the "test" clause of the outer ternary expression. The `email` assignment statement has a ternary expression nested inside the "then" (aka "consequent") clause of the outer ternary expression. The `accountType` assignment statement nests ternary expressions in the "else" (aka "alternate") clauses of their outer ternary expressions. Also, the `accountType` assignment statement has **two levels of nesting**, whereas the `name` and `email` assignment statements each have ternary expressions with **one level of nesting**.

To allow nesting in a specific clause (`"test"`, `"then"`, and `"else"`), that clause type must be configured on. To allow nesting beyond one level, the `"depth"` configuration must be increased.

### Rule Configuration

The **proper-ternary**/*nested* rule can be configured with various combinations of these modes:

* [`"test"`](#rule-nested-configuration-clauses) (default: `false`) allows a ternary expression nested in the "test" clause of another ternary expression.

* [`"then"`](#rule-nested-configuration-clauses) (default: `false`) allows a ternary expression nested in the "then" (aka, "consequent") clause of another ternary expression.

* [`"else"`](#rule-nested-configuration-clauses) (default: `false`) allows a ternary expression nested in the "else" (aka, "alternate") clause of another ternary expression.

* [`"depth"`](#rule-nested-configuration-depth) (default: `1`) controls how many levels of nesting of ternary expressions are allowed. To effectively use this option, you must also enable at least one of the `"test"` / `"then"` / `"else"` clause modes.

**Note:** This rule does not consider stylistic readability affordances like whitespace or parentheses (see [`"parens"` rule](#rule-parens)), only structural questions of nesting.

#### Rule `"nested"` Configuration: Clauses

To configure the `"test"`, `"then"`, or `"else"` rule modes (each default: `false`):

```json
"@getify/proper-ternary/nested": [ "error", { "test": true, "then": true, "else": true }
```

Each clause must be explicitly enabled for nested ternary expressions to be allowed there. Leaving all three clause types disabled effectively disables all ternary expression nesting.

##### `"test"` Nesting

If `"test"` mode is enabled, nesting a ternary expression in the *test* clause looks like this:

```js
var name =
    (typeof isLoggedIn == "function" ? isLoggedIn() : false)
        ? userData.name
        : "-empty-";
```

This form is equivalent to the fairly awkward:

```js
var name;
if (
    (typeof isLoggedIn == "function" || false) && isLoggedIn()
) {
    name = userData.name;
}
else {
    name = "-empty-";
}
```

The awkward/confusing boolean logic in this `if..else` equivalent form suggests a simpler way to structure the logic:

```js
var name;
if (typeof isLoggedIn == "function" && isLoggedIn()) {
    name = userData.name;
}
else {
    name = "-empty-";
}

```

And while that logic certainly makes more sense, it illustrates why nesting ternary expressions in the *test* clause is rarer, as there's basically no need for the extra conditional in the first place:

```js
var name =
    (typeof isLoggedIn == "function" && isLoggedIn())
        ? userData.name
        : "-empty-";
```

The main reason to prefer the ternary expression form in this case, over the `if..else` form, is that it's more clear in this latter form that there's a single variable `name` being assigned one of two values. With the `if..else` form, there are two separate assignments, so this detail is slightly less obvious.

##### `"then"` Nesting

If the `"then"` mode is enabled, the more common nesting of a ternary expression in the *then* clause of another ternary expression looks like:

```js
var email =
    userData != null
        ? (userData.email != "" ? userData.email : "nobody@email.tld")
        : "-empty-";
```

In this form, it's clear that there's a single variable `email` being assigned. The `if..else` equivalent:

```js
var email;
if (userData != null) {
    if (userData.email != "") {
        email = userData.email;
    }
    else {
        email = "nobody@email.tld";
    }
}
else {
    email = "-empty-";
}
```

In this form, the single assignment (with one of three values) is a little less obvious. Generally, the former ternary expression form would be preferred as a bit more readable in cases like this.

##### `"else"` Nesting

If the `"else"` mode is enabled, nesting a ternary expression in the *else* clause of another ternary expression is perhaps the most readable of the ternary expression nesting variations:

```js
var accountType =
    userData.type == 1 ? "admin"   :
    userData.type == 2 ? "manager" :
    userData.type == 3 ? "vendor"  :
    "customer";
```

In this form, it's fairly clear that there's a single variable `accountType` being assigned one of four values, based on three specific comparisons, with the fourth value being the default "else" value.

The more verbose `if..else if` equivalent:

```js
var accountType;
if (userData.type == 1) {
    accountType = "admin";
}
else if (userData.type == 2) {
    accountType = "manager";
}
else if (userData.type == 3) {
    accountType = "vendor";
}
else {
    accountType = "customer";
}
```

The single variable (`accountType`) assignment is a little less obvious in this form, and there's more syntactic noise just to accomplish the same result. So, the ternary expression form may be a bit more preferable.

#### Rule `"nested"` Configuration: `"depth"`

To configure this rule mode (default: `1`):

```json
"@getify/proper-ternary/nested": [ "error", { "depth": 1 } ]
```

If any of the [`"test"` / `"then"` / `"else"` modes](#rule-nested-configuration-clauses) are enabled, you can also control how many levels of ternary expression nesting are allowed with the `"depth"` setting.

For example, by default this rule mode would not report any errors for this ternary expression:

```js
var accountType =
    userData.type == 1 ? "admin"   :
    userData.type == 2 ? "manager" :
    "customer";
```

The nesting level is `1` (inside the second/outermost ternary expression).

By contrast, this rule mode *would* by default report errors for:

```js
var accountType =
    userData.type == 1 ? "admin"   :
    userData.type == 2 ? "manager" :
    userData.type == 3 ? "vendor"  :
    "customer";
```

Here, the nesting level is `2` (inside the third/outermost ternary expression), so the default nesting level of `1` would cause an error to be reported for the `userData.type == 3 ? ..` ternary expression.

## Rule: `"parens"`

The **proper-ternary**/*parens* rule requires `( .. )` parentheses surrounding various expression types when they appear in any clause of a ternary expression.

To turn this rule on:

```json
"@getify/proper-ternary/parens": "error"
```

The main purpose of this rule is to avoid readability harm for `? :` ternary expressions by requiring disambiguating `( .. )` around any clause's expression if that expression's boundary isn't obvious, such as operator associativity or precedence, for example.

For example:

```js
var total = 1 + base ? base * 2 : base * 3;
```

Without looking up operator precedence, a reader may not be confident whether the `1 + ` part belongs to the *test* clause of the ternary, or is added after the ternary is resolved. In other words, that example could reasonably be assumed as either of these:

```js
var total = (1 + base) ? base * 2 : base * 3;

// OR

var total = 1 + (base ? base * 2 : base * 3);
```

Which is it? Because of operator precedence, it's the first one (`(1 + base) ? ..`). But this kind of ambiguity can really harm readability. Moreover, when quickly scanning the code, the `base * 2` and `base * 3` expressions can obscure the location of the `?` and `:` operators and thus the clause boundaries.

Consider a more readable alternative:

```js
var total = (1 + base) ? (base * 2) : (base * 3);
```

Yes, the `( .. )` are "unnecessary", but they certainly eliminate the ambiguity from such examples. Readability affordances such as this should be favored.

The default behavior of this rule is aggressive, in that it requires parentheses around **all clause expression types** (except simple identifiers/literals); it will **report errors** for each of these ternary expression clauses here:

```js
var total = base > 1 ? base * 2 : base * 3;
```

The `base > 1` expression is a *comparison* expression, and can be allowed by disabling the [`"comparison"`](#rule-parens-configuration-comparison) mode. The `base * 2` and `base * 3` expressions are *complex*; there is **no mode in this rule** to disable reporting errors for them.

### Rule Configuration

The **proper-ternary**/*parens* rule can be configured with any combination of these modes, applied to expressions in **any of the clauses** of a ternary expression:

* [`"ternary"`](#rule-parens-configuration-ternary) (default: `true`) requires a nested ternary expression to have `( .. )` surrounding it.

* [`"comparison"`](#rule-parens-configuration-comparison) (default: `true`) requires a comparison expression (ie, `x == y`, `x > y`, etc) to have `( .. )` surrounding it.

* [`"logical"`](#rule-parens-configuration-logical) (default: `true`) requires a logical expression (ie, `x && y`, `!x`, etc) to have `( .. )` surrounding it.

* [`"call"`](#rule-parens-configuration-call) (default: `true`) requires a call expression (ie, `foo()`, `new Foo()`, etc) to have `( .. )` surrounding it.

* [`"object"`](#rule-parens-configuration-object) (default: `true`) requires an object or array literal (ie, `{x:1}`, `[1,2]`, etc) to have `( .. )` surrounding it.

* [`"simple"`](#rule-parens-configuration-simple) (**default: `false`**) requires a simple expression (ie, `x`, `x.y`, `42`, etc) to have `( .. )` surrounding it. It's likely you'll want to keep this mode disabled (default).

**Note:** Any expression not covered by these modes, such as `x + y`, is considered a *complex* expression. If this rule is enabled, complex expressions always require `( .. )` surrounding them; there is no `"complex"` mode to disable them. Reasoning: if you feel that `x + y * z` is a sufficient expression to not need `( .. )`, then you almost certainly would be inclined to disable all the other above modes too, in which case you should just disable the rule entirely.

#### Rule `"nested"` Configuration: Ternary

To configure this rule mode off (on by default):

```json
"@getify/proper-ternary/parens": [ "error", { "ternary": false } ]
```

If this mode is on (default), it will report an error for:

```js
var x = y ? z : w ? u : v;
```

To avoid this error, use `( .. )` around the nested ternary:

```js
var x = y ? z : (w ? u : v);
```

#### Rule `"nested"` Configuration: Comparison

To configure this rule mode off (on by default):

```json
"@getify/proper-ternary/parens": [ "error", { "comparison": false } ]
```

If this mode is on (default), it will report an error for:

```js
var x = y > 3 ? y : z;
```

To avoid this error, use `( .. )` around the comparison expression:

```js
var x = (y > 3) ? y : z;
```

#### Rule `"nested"` Configuration: Logical

To configure this rule mode off (on by default):

```json
"@getify/proper-ternary/parens": [ "error", { "logical": false } ]
```

If this mode is on (default), it will report an error for:

```js
var x = y && z ? y : z;
```

To avoid this error, use `( .. )` around the logical expression:

```js
var x = (y && z) ? y : z;
```

#### Rule `"nested"` Configuration: Call

To configure this rule mode off (on by default):

```json
"@getify/proper-ternary/parens": [ "error", { "call": false } ]
```

If this mode is on (default), it will report an error for:

```js
var x = y ? foo(y,z) : z;
```

To avoid this error, use `( .. )` around the call expression:

```js
var x = y ? ( foo(y,z) ) : z;
```

#### Rule `"nested"` Configuration: Object

**Note:** This rule mode applies to both array literals (`[1,2]`) and object literals (`{x:1}`).

To configure this rule mode off (on by default):

```json
"@getify/proper-ternary/parens": [ "error", { "object": false } ]
```

If this mode is on (default), it will report an error for:

```js
var x = y ? [y,z] : z;
```

To avoid this error, use `( .. )` around the array or object expression:

```js
var x = y ? ( [y,z] ) : z;
```

#### Rule `"nested"` Configuration: Simple

**Note:** It's very likely that you'll want to keep this mode off (default), as it's unlikely that you'll want to require `( .. )` around even simple identifiers and primitive literals.

To configure this rule mode **on** (**off** by default):

```json
"@getify/proper-ternary/parens": [ "error", { "simple": true } ]
```

If this mode is on, it will report errors for each clause:

```js
var x = y ? w.u : 42;
```

To avoid these errors, use `( .. )` around each ternary clause's expression:

```js
var x = (y) ? (w.u) : (42);
```

## Rule: `"where"`

The **proper-ternary**/*where* rule restricts where in program structure ternary expressions can be used.

To turn this rule on:

```json
"@getify/proper-ternary/where": "error"
```

The main purpose of this rule is to avoid readability harm for the program when `? :` ternary expressions are misused. By restricting ternary expressions to certain usages, the ternary-forbidden usages are structured using more appropriate syntax/logic.

For example, some strongly feel ternary expressions should only be used as expressions (meaning conditionally selecting a value) and not as standalone statements like:

```js
(isLoggedIn(user) && user.admin)
    ? renderAdminHeader()
    : renderBasicHeader();
```

This construct can be confusing to the reader, as it's easy to miss side-effects in either the *then* or *else* clause. A more preferred approach is to use a standalone `if..else` statement:

```js
if (isLoggedIn(user) && user.admin) {
    renderAdminHeader();
}
else {
    renderBasicHeader();
}
```

This scenario is exactly what the `if..else` statement is best at; abusing a ternary expression to save a few characters is not helpful for readability.

Another example:

```js
var loginRecord = {
    name: userData.name,
    accountType: (
        userData.type == 1 ? "admin"   :
        userData.type == 2 ? "manager" :
        userData.type == 3 ? "vendor"  :
        "customer"
    )
};
```

Here a ternary is being used inside an object literal, but a perhaps more readable approach would be to first choose the value via a variable assignment:

```js
var accountType =
    userData.type == 1 ? "admin"   :
    userData.type == 2 ? "manager" :
    userData.type == 3 ? "vendor"  :
    "customer";

var loginRecord = {
    name: userData.name,
    accountType
};
```

A similar situation arises with arguments to function calls: because arguments generally don't have obvious names at the call-site, using a ternary expression as an argument can be less readable if for no other reason than lack of any semantic name to describe the value selection. It's often better to perform the ternary conditional value selection in an assignment first, then pass that named variable as the argument.

It can also be harder to read code when a ternary expression is a sub-expression in another expression, such as the unary `!` negation expression below:

```js
var isAllowed = !(
    (userSession != null)
        ? userSession.user.accountType == "customer"
        : defaultAccountType == "vendor"
);
```

The indirect negation logic here is more confusing to the reader. A better approach:

```js
var basicAccountType =
    (userSession != null)
        ? userSession.user.accountType == "customer"
        : defaultAccountType == "vendor";

var isAllowed = !basicAccountType;
```

By semantically naming the result of the ternary decision (`basicAccountType`), the negation is clearer to understand.

Of course, in this example, the ternary itself isn't strictly necessary, as the logic could have been structured as:

```js
var basicAccountType = (
    (userSession != null && userSession.user.accountType == "customer") ||
    (defaultAccountType == "vendor")
);

var isAllowed = !basicAccountType;
```

Some will prefer the ternary version and others will prefer this non-ternary form.

### Rule Configuration

The **proper-ternary**/*where* rule can be configured with any combination of these modes:

* [`"statement"`](#rule-where-configuration-statement) (default: `true`) forbids a standalone ternary expression statement.

* [`"property"`](#rule-where-configuration-property) (default: `true`) forbids a ternary expression in an object literal property assignment or array literal position assignment.

* [`"argument"`](#rule-where-configuration-argument) (default: `true`) forbids a ternary expression as an argument to a function call.

* [`"return"`](#rule-where-configuration-return) (default: `true`) forbids a ternary expression in a `return` statement of a function, as well as the concise return of an `=>` arrow function.

* [`"default"`](#rule-where-configuration-default) (default: `true`) forbids a ternary expression in a default value expression (function parameters and destructuring patterns).

* [`"sub"`](#rule-where-configuration-sub) (default: `true`) forbids a ternary expression as a sub-expression of a unary/binary operator expression (ie, `1 + (x ? y : z)`).

   **Note:** This rule mode does not control ternary expressions nested in other ternary expressions. For that, use the [`"nested"` rule](#rule-nested).

* [`"assignment"`](#rule-where-configuration-assignment) (default: **`false`**) forbids a ternary expression in assignment statements (using the `=` operator).

   **Note:** Unlike the other rule modes here, this mode is turned off by default, because it's unlikely that you'll want to disable ternary expressions in assignment expressions (ie, `x = y ? z : w`), as this is basically where they're most naturally useful. It's included for completeness sake, but if you're inclined to turn this rule mode on, you perhaps might just consider disabling all ternary expressions with the built-in ["no-ternary" rule](https://eslint.org/docs/rules/no-ternary).

#### Rule `"where"` Configuration: Statement

To configure this rule mode off (on by default):

```json
"@getify/proper-ternary/where": [ "error", { "statement": false } ]
```

If this mode is on (default), it will report an error for:

```js
(isLoggedIn(user) && user.admin)
    ? renderAdminHeader()
    : renderBasicHeader();
```

To avoid this error, use an `if..else` statement instead:

```js
if (isLoggedIn(user) && user.admin) {
    renderAdminHeader();
}
else {
    renderBasicHeader();
}
```

#### Rule `"where"` Configuration: Property

To configure this rule mode off (on by default):

```json
"@getify/proper-ternary/where": [ "error", { "property": false } ]
```

If this mode is on (default), it will report an error for:

```js
var loginRecord = {
    name: userData.name,
    accountType: (
        userData.type == 1 ? "admin"   :
        userData.type == 2 ? "manager" :
        userData.type == 3 ? "vendor"  :
        "customer"
    )
};
```

To avoid this error, use an `if..else` statement instead:

```js
var accountType =
    userData.type == 1 ? "admin"   :
    userData.type == 2 ? "manager" :
    userData.type == 3 ? "vendor"  :
    "customer";

var loginRecord = {
    name: userData.name,
    accountType
};
```

#### Rule `"where"` Configuration: Property

To configure this rule mode off (on by default):

```json
"@getify/proper-ternary/where": [ "error", { "property": false } ]
```

If this mode is on (default), it will report an error for:

```js
var loginRecord = {
    name: userData.name,
    accountType: (
        userData.type == 1 ? "admin"   :
        userData.type == 2 ? "manager" :
        userData.type == 3 ? "vendor"  :
        "customer"
    )
};
```

To avoid this error, use an `if..else` statement instead:

```js
var accountType =
    userData.type == 1 ? "admin"   :
    userData.type == 2 ? "manager" :
    userData.type == 3 ? "vendor"  :
    "customer";

var loginRecord = {
    name: userData.name,
    accountType
};
```

#### Rule `"where"` Configuration: Argument

To configure this rule mode off (on by default):

```json
"@getify/proper-ternary/where": [ "error", { "argument": false } ]
```

If this mode is on (default), it will report an error for:

```js
checkAccount(
    (isLoggedIn(user) && user.admin) ? user : defaultUser
);
```

To avoid this error, first assign the result of the ternary expression to a variable:

```js
var accountToCheck =
    (isLoggedIn(user) && user.admin) ? user : defaultUser;

checkAccount(accountToCheck);
```

#### Rule `"where"` Configuration: Return

To configure this rule mode off (on by default):

```json
"@getify/proper-ternary/where": [ "error", { "argument": false } ]
```

If this mode is on (default), it will report an error for:

```js
function lookupAccount(userID = -1) {
    return (
        userID != -1 ? users[userID] : defaultUser
    );
}
```

To avoid this error, first assign the result of the ternary expression to a variable:

```js
function lookupAccount(userID = -1) {
    var user =
        userID != -1 ? users[userID] : defaultUser;

    return user;
}
```

#### Rule `"where"` Configuration: Default

To configure this rule mode off (on by default):

```json
"@getify/proper-ternary/where": [ "error", { "default": false } ]
```

If this mode is on (default), it will report an error for:

```js
function createUser(data,cb = data.adminUser ? onAdminUser : () => {}) {
    // ..
    cb(user);
}
```

To avoid this error, (re)assign the variable manually:

```js
function createUser(data,cb) {
    cb =
        cb !== undefined ? cb          :
        data.adminUser   ? onAdminUser :
        () => {};

    // ..
    cb(user);
}
```

#### Rule `"where"` Configuration: Sub

To configure this rule mode off (on by default):

```json
"@getify/proper-ternary/where": [ "error", { "sub": false } ]
```

If this mode is on (default), it will report an error for:

```js
var isAllowed = !(
    (userSession != null)
        ? userSession.user.accountType == "customer"
        : defaultAccountType == "vendor"
);
```

To avoid this error, first assign the result of the ternary expression to a variable:

```js
var basicAccountType =
    (userSession != null)
        ? userSession.user.accountType == "customer"
        : defaultAccountType == "vendor";

var isAllowed = !basicAccountType;
```

#### Rule `"where"` Configuration: Assignment

**Note:** It's unlikely that you'll want to disable ternary expressions in assignment expressions (ie, `x = y ? z : w`), as this is basically where they're most naturally useful. This rule mode is included for completeness sake, but if you're inclined to turn it on, you perhaps might just consider disabling all ternary expressions with the built-in ["no-ternary" rule](https://eslint.org/docs/rules/no-ternary).

To configure this rule mode **on** (**off** by default):

```json
"@getify/proper-ternary/where": [ "error", { "assignment": true } ]
```

If this mode is on (default), it will report an error for:

```js
var name = userRecord != null ? userRecord.name : "Kyle";
```

To avoid this error, use an `if..else` statement instead of a ternary expression:

```js
var name;
if (userRecord != null) {
    name = userRecord.name;
}
else {
    name = "Kyle";
}
```

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
