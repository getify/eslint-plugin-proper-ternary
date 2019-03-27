"use strict";

var linterOptions = {
	nestedDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/nested": "error", },
	},
	nestedEmptyOptions: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/nested": [ "error", {}, ], },
	},
	nestedAllOnDepth1000: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/nested": [ "error", { test: true, then: true, else: true, depth: 1000, }, ], },
	},
	nestedTestOnly: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/nested": [ "error", { test: true, depth: 1000, }, ], },
	},
	nestedThenOnly: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/nested": [ "error", { then: true, depth: 1000, }, ], },
	},
	nestedElseOnly: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/nested": [ "error", { else: true, depth: 1000, }, ], },
	},
	nestedDepth2: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/nested": [ "error", { test: true, then: true, else: true, depth: 2, }, ], },
	},
};

QUnit.test( "NESTED (default): conforming", function test(assert){
	var code = `
		var v = x ? y : z;
	`;

	var results = eslinter.verify( code, linterOptions.nestedDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "NESTED (default): violating", function test(assert){
	var code = `
		var v = (x ? y : z) ? (w ? r : p) : g ? h : j;
	`;

	var results = eslinter.verify( code, linterOptions.nestedDefault );
	var [
		{ ruleId: ruleId1, messageId: messageId1, message: message1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, message: message2, } = {},
		{ ruleId: ruleId3, messageId: messageId3, message: message3, } = {},
		{ ruleId: ruleId4, messageId: messageId4, message: message4, } = {},
	] = results || [];

	assert.expect( 12 );
	assert.strictEqual( results.length, 4, "only 4 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-ternary/nested", "ruleId1" );
	assert.strictEqual( messageId1, "notHere", "messageId1" );
	assert.ok( message1.includes("'test' clause"), "message1" );
	assert.strictEqual( ruleId2, "@getify/proper-ternary/nested", "ruleId2" );
	assert.strictEqual( messageId2, "tooDeep", "messageId2" );
	assert.strictEqual( ruleId3, "@getify/proper-ternary/nested", "ruleId3" );
	assert.strictEqual( messageId3, "notHere", "messageId3" );
	assert.ok( message3.includes("'then' clause"), "message3" );
	assert.strictEqual( ruleId4, "@getify/proper-ternary/nested", "ruleId4" );
	assert.strictEqual( messageId4, "notHere", "messageId4" );
	assert.ok( message4.includes("'else' clause"), "message4" );
} );

QUnit.test( "NESTED (empty options): violating", function test(assert){
	var code = `
		var v = (x ? y : z) ? (w ? r : p) : g ? h : j;
	`;

	var results = eslinter.verify( code, linterOptions.nestedEmptyOptions );
	var [
		{ ruleId: ruleId1, messageId: messageId1, message: message1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, message: message2, } = {},
		{ ruleId: ruleId3, messageId: messageId3, message: message3, } = {},
		{ ruleId: ruleId4, messageId: messageId4, message: message4, } = {},
	] = results || [];

	assert.expect( 12 );
	assert.strictEqual( results.length, 4, "only 4 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-ternary/nested", "ruleId1" );
	assert.strictEqual( messageId1, "notHere", "messageId1" );
	assert.ok( message1.includes("'test' clause"), "message1" );
	assert.strictEqual( ruleId2, "@getify/proper-ternary/nested", "ruleId2" );
	assert.strictEqual( messageId2, "tooDeep", "messageId2" );
	assert.strictEqual( ruleId3, "@getify/proper-ternary/nested", "ruleId3" );
	assert.strictEqual( messageId3, "notHere", "messageId3" );
	assert.ok( message3.includes("'then' clause"), "message3" );
	assert.strictEqual( ruleId4, "@getify/proper-ternary/nested", "ruleId4" );
	assert.strictEqual( messageId4, "notHere", "messageId4" );
	assert.ok( message4.includes("'else' clause"), "message4" );
} );

QUnit.test( "NESTED (all on, depth: 1000): conforming", function test(assert){
	var code = `
		v = (x ? y : z) ? (w ? r : p) : foo(g ? h : j ? k : m);
	`;

	var results = eslinter.verify( code, linterOptions.nestedAllOnDepth1000 );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "NESTED (test): conforming", function test(assert){
	var code = `
		var v = ((x ? y : z) ? w : u) ? g : h;
	`;

	var results = eslinter.verify( code, linterOptions.nestedTestOnly );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "NESTED (test): violating", function test(assert){
	var code = `
		var v = ((x ? y : z) ? w : u) ? g : h ? k : m;
	`;

	var results = eslinter.verify( code, linterOptions.nestedTestOnly );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-ternary/nested", "ruleId" );
	assert.strictEqual( messageId, "notHere", "messageId" );
} );

QUnit.test( "NESTED (then): conforming", function test(assert){
	var code = `
		var v = x ? (y ? (z ? w : u) : g) : h;
	`;

	var results = eslinter.verify( code, linterOptions.nestedThenOnly );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "NESTED (then): violating", function test(assert){
	var code = `
		var v = x ? (y ? (z ? w : u) : g) : h ? k : m;
	`;

	var results = eslinter.verify( code, linterOptions.nestedThenOnly );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-ternary/nested", "ruleId" );
	assert.strictEqual( messageId, "notHere", "messageId" );
} );

QUnit.test( "NESTED (else): conforming", function test(assert){
	var code = `
		var v = x ? y : z ? w : u ? g : h;
	`;

	var results = eslinter.verify( code, linterOptions.nestedElseOnly );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "NESTED (else): violating", function test(assert){
	var code = `
		var v = (x ? k : m) ? y : z ? w : u ? g : h;
	`;

	var results = eslinter.verify( code, linterOptions.nestedElseOnly );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-ternary/nested", "ruleId" );
	assert.strictEqual( messageId, "notHere", "messageId" );
} );

QUnit.test( "NESTED (depth: 2): conforming", function test(assert){
	var code = `
		var v = x ? y : z ? w : u ? g : h;
	`;

	var results = eslinter.verify( code, linterOptions.nestedDepth2 );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "NESTED (depth: 2): violating", function test(assert){
	var code = `
		var v = x ? y : z ? w : u ? g : h ? k : m
	`;

	var results = eslinter.verify( code, linterOptions.nestedDepth2 );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-ternary/nested", "ruleId" );
	assert.strictEqual( messageId, "tooDeep", "messageId" );
} );
