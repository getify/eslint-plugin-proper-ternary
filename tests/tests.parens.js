"use strict";

var linterOptions = {
	parensDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/parens": "error", },
	},
};

QUnit.test( "PARENS (default): conforming", function test(assert){
	var code = `
		var v1 = (x) ? (y) : ((x) ? (y) : (z));
		var v2 = (x) ? (y) : (x == y);
		var v3 = (x) ? (y) : (x && y);
		var v4 = (x) ? (y) : (foo(x,y));
		var v5 = (x) ? (y) : ({ x: y });
		var v6 = (x) ? (y) : (x.y);
		var v7 = (x) ? (y) : (x + y);
	`;

	var results = eslinter.verify( code, linterOptions.parensDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARENS (default): violating", function test(assert){
	var code = `
		var v1 = (x) ? (y) : (x) ? (y) : (z);
		var v2 = (x) ? (y) : x == y;
		var v3 = (x) ? (y) : x && y;
		var v4 = (x) ? (y) : foo(x,y);
		var v5 = (x) ? (y) : { x: y };
		var v6 = (x) ? (y) : x.y;
		var v7 = (x) ? (y) : x + y;
	`;

	var results = eslinter.verify( code, linterOptions.parensDefault );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
		{ ruleId: ruleId3, messageId: messageId3, } = {},
		{ ruleId: ruleId4, messageId: messageId4, } = {},
		{ ruleId: ruleId5, messageId: messageId5, } = {},
		{ ruleId: ruleId6, messageId: messageId6, } = {},
		{ ruleId: ruleId7, messageId: messageId7, } = {},
	] = results || [];

	assert.expect( 15 );
	assert.strictEqual( results.length, 7, "only 7 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-ternary/parens", "ruleId1" );
	assert.strictEqual( messageId1, "needParens", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-ternary/parens", "ruleId2" );
	assert.strictEqual( messageId2, "needParens", "messageId2" );
	assert.strictEqual( ruleId3, "@getify/proper-ternary/parens", "ruleId3" );
	assert.strictEqual( messageId3, "needParens", "messageId3" );
	assert.strictEqual( ruleId4, "@getify/proper-ternary/parens", "ruleId4" );
	assert.strictEqual( messageId4, "needParens", "messageId4" );
	assert.strictEqual( ruleId5, "@getify/proper-ternary/parens", "ruleId5" );
	assert.strictEqual( messageId5, "needParens", "messageId5" );
	assert.strictEqual( ruleId6, "@getify/proper-ternary/parens", "ruleId6" );
	assert.strictEqual( messageId6, "needParens", "messageId6" );
	assert.strictEqual( ruleId7, "@getify/proper-ternary/parens", "ruleId7" );
	assert.strictEqual( messageId7, "needParens", "messageId7" );
} );
