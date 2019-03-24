"use strict";

var linterOptions = {
	nestedDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/nested": "error", },
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
	assert.ok( /'test' clause/.test(message1), "message1" );
	assert.strictEqual( ruleId2, "@getify/proper-ternary/nested", "ruleId2" );
	assert.strictEqual( messageId2, "tooDeep", "messageId2" );
	assert.strictEqual( ruleId3, "@getify/proper-ternary/nested", "ruleId3" );
	assert.strictEqual( messageId3, "notHere", "messageId3" );
	assert.ok( /'then' clause/.test(message3), "message3" );
	assert.strictEqual( ruleId4, "@getify/proper-ternary/nested", "ruleId4" );
	assert.strictEqual( messageId4, "notHere", "messageId4" );
	assert.ok( /'else' clause/.test(message4), "message4" );
} );
