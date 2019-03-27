#!/usr/bin/env node

"use strict";

var path = require("path");

var Linter = require("eslint").Linter;
var eslinter = global.eslinter = new Linter();
var properTernary;

/* istanbul ignore next */
if (process.env.TEST_DIST) {
	properTernary = require(path.join(__dirname,"..","dist","eslint-plugin-proper-ternary.js"));
}
/* istanbul ignore next */
else if (process.env.TEST_PACKAGE) {
	properTernary = require(path.join(__dirname,".."));
}
else {
	properTernary = require(path.join(__dirname,"..","lib","index.js"));
}

eslinter.defineRule("@getify/proper-ternary/nested",properTernary.rules.nested);
eslinter.defineRule("@getify/proper-ternary/parens",properTernary.rules.parens);
eslinter.defineRule("@getify/proper-ternary/where",properTernary.rules.where);

global.QUnit = require("qunit");

require(path.join("..","tests","qunit.config.js"));
require(path.join("..","tests","tests.nested.js"));
require(path.join("..","tests","tests.parens.js"));
require(path.join("..","tests","tests.where.js"));

QUnit.start();
