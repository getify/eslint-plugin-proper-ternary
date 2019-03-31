"use strict";

var linterOptions = {
	parensDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/parens": "error", },
	},
	parensEmptyOptions: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/parens": [ "error", {}, ], },
	},
	parensAllOff: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/parens": [ "error", { ternary: false, comparison: false, logical: false, call: false, object: false, simple: false, }, ], },
	},
	parensOnlyTernary: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/parens": [ "error", { ternary: true, comparison: false, logical: false, call: false, object: false, simple: false, }, ], },
	},
	parensOnlyComparison: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/parens": [ "error", { ternary: false, comparison: true, logical: false, call: false, object: false, simple: false, }, ], },
	},
	parensOnlyLogical: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/parens": [ "error", { ternary: false, comparison: false, logical: true, call: false, object: false, simple: false, }, ], },
	},
	parensOnlyCall: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/parens": [ "error", { ternary: false, comparison: false, logical: false, call: true, object: false, simple: false, }, ], },
	},
	parensOnlyObject: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/parens": [ "error", { ternary: false, comparison: false, logical: false, call: false, object: true, simple: false, }, ], },
	},
	parensOnlySimple: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/parens": [ "error", { ternary: false, comparison: false, logical: false, call: false, object: false, simple: true, }, ], },
	},
};

QUnit.test( "PARENS (default): conforming", function test(assert){
	var code = `
		var v1 = x ? y : (x ? y : z);
		var v2 = x ? y : (x == y);
		var v3 = x ? y : (x && y);
		var v4 = x ? y : (foo(x,y));
		var v5 = x ? y : ({ x: y });
		var v6 = x ? y : x.y;
		var v7 = x ? y : (x + y);
	`;

	var results = eslinter.verify( code, linterOptions.parensDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARENS (default): violating", function test(assert){
	var code = `
		var v1 = x ? y : x ? y : z;
		var v2 = x ? y : x == y;
		var v3 = x ? y : x && y;
		var v4 = x ? y : foo(x,y);
		var v5 = x ? y : { x: y };
		var v6 = x ? y : x.y;
		var v7 = x ? y : x + y;
	`;

	var results = eslinter.verify( code, linterOptions.parensDefault );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
		{ ruleId: ruleId3, messageId: messageId3, } = {},
		{ ruleId: ruleId4, messageId: messageId4, } = {},
		{ ruleId: ruleId5, messageId: messageId5, } = {},
		{ ruleId: ruleId6, messageId: messageId6, } = {},
	] = results || [];

	assert.expect( 13 );
	assert.strictEqual( results.length, 6, "only 6 errors" );
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
} );

QUnit.test( "PARENS (empty options): violating", function test(assert){
	var code = `
		var v1 = x ? y : x ? y : z;
		var v2 = x ? y : x == y;
		var v3 = x ? y : x && y;
		var v4 = x ? y : foo(x,y);
		var v5 = x ? y : { x: y };
		var v6 = x ? y : x.y;
		var v7 = x ? y : x + y;
	`;

	var results = eslinter.verify( code, linterOptions.parensEmptyOptions );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
		{ ruleId: ruleId3, messageId: messageId3, } = {},
		{ ruleId: ruleId4, messageId: messageId4, } = {},
		{ ruleId: ruleId5, messageId: messageId5, } = {},
		{ ruleId: ruleId6, messageId: messageId6, } = {},
	] = results || [];

	assert.expect( 13 );
	assert.strictEqual( results.length, 6, "only 6 errors" );
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
} );

QUnit.test( "PARENS (all off): conforming", function test(assert){
	var code = `
		var v1 = x ? y : x ? y : z;
		var v2 = x ? y : x == y;
		var v3 = x ? y : x && y;
		var v4 = x ? y : foo(x,y);
		var v5 = x ? y : { x: y };
		var v6 = x ? y : x.y;
	`;

	var results = eslinter.verify( code, linterOptions.parensAllOff );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARENS (ternary): conforming", function test(assert){
	var code = `
		var v1 = x ? y : (x ? y : z);
		var v2 = x ? y : x == y;
		var v3 = x ? y : x && y;
		var v4 = x ? y : foo(x,y);
		var v5 = x ? y : { x: y };
		var v6 = x ? y : x.y;
	`;

	var results = eslinter.verify( code, linterOptions.parensOnlyTernary );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARENS (ternary): violating", function test(assert){
	var code = `
		var v1 = x ? y : x ? y : z;
		var v2 = x ? y : x == y;
		var v3 = x ? y : x && y;
		var v4 = x ? y : foo(x,y);
		var v5 = x ? y : { x: y };
		var v6 = x ? y : x.y;
	`;

	var results = eslinter.verify( code, linterOptions.parensOnlyTernary );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-ternary/parens", "ruleId" );
	assert.strictEqual( messageId, "needParens", "messageId" );
} );

QUnit.test( "PARENS (comparison): conforming", function test(assert){
	var code = `
		var v1 = x ? y : x ? y : z;
		var v2 = x ? y : (x == y);
		var v3 = x ? y : x && y;
		var v4 = x ? y : foo(x,y);
		var v5 = x ? y : { x: y };
		var v6 = x ? y : x.y;
	`;

	var results = eslinter.verify( code, linterOptions.parensOnlyComparison );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARENS (comparison): violating", function test(assert){
	var code = `
		var v1 = x ? y : x ? y : z;
		var v2 = x ? y : x == y;
		var v3 = x ? y : x && y;
		var v4 = x ? y : foo(x,y);
		var v5 = x ? y : { x: y };
		var v6 = x ? y : x.y;
	`;

	var results = eslinter.verify( code, linterOptions.parensOnlyComparison );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-ternary/parens", "ruleId" );
	assert.strictEqual( messageId, "needParens", "messageId" );
} );

QUnit.test( "PARENS (logical): conforming", function test(assert){
	var code = `
		var v1 = x ? y : x ? y : z;
		var v2 = x ? y : x == y;
		var v3 = x ? y : (x && y);
		var v4 = x ? y : (!z);
		var v5 = x ? y : foo(x,y);
		var v6 = x ? y : { x: y };
		var v7 = x ? y : x.y;
	`;

	var results = eslinter.verify( code, linterOptions.parensOnlyLogical );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARENS (logical): violating", function test(assert){
	var code = `
		var v1 = x ? y : x ? y : z;
		var v2 = x ? y : x == y;
		var v3 = x ? y : x && y;
		var v4 = x ? y : !z;
		var v5 = x ? y : foo(x,y);
		var v6 = x ? y : { x: y };
		var v7 = x ? y : x.y;
	`;

	var results = eslinter.verify( code, linterOptions.parensOnlyLogical );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-ternary/parens", "ruleId1" );
	assert.strictEqual( messageId1, "needParens", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-ternary/parens", "ruleId2" );
	assert.strictEqual( messageId2, "needParens", "messageId2" );
} );

QUnit.test( "PARENS (call): conforming", function test(assert){
	var code = `
		var v1 = x ? y : x ? y : z;
		var v2 = x ? y : x == y;
		var v3 = x ? y : x && y;
		var v4 = x ? y : (foo(x,y));
		var v5 = x ? y : { x: y };
		var v6 = x ? y : x.y;
	`;

	var results = eslinter.verify( code, linterOptions.parensOnlyCall );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARENS (call): violating", function test(assert){
	var code = `
		var v1 = x ? y : x ? y : z;
		var v2 = x ? y : x == y;
		var v3 = x ? y : x && y;
		var v4 = x ? y : foo(x,y);
		var v5 = x ? y : { x: y };
		var v6 = x ? y : x.y;
	`;

	var results = eslinter.verify( code, linterOptions.parensOnlyCall );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-ternary/parens", "ruleId" );
	assert.strictEqual( messageId, "needParens", "messageId" );
} );

QUnit.test( "PARENS (object): conforming", function test(assert){
	var code = `
		var v1 = x ? y : x ? y : z;
		var v2 = x ? y : x == y;
		var v3 = x ? y : x && y;
		var v4 = x ? y : foo(x,y);
		var v5 = x ? y : ({ x: y });
		var v6 = x ? y : x.y;
	`;

	var results = eslinter.verify( code, linterOptions.parensOnlyObject );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARENS (object): violating", function test(assert){
	var code = `
		var v1 = x ? y : x ? y : z;
		var v2 = x ? y : x == y;
		var v3 = x ? y : x && y;
		var v4 = x ? y : foo(x,y);
		var v5 = x ? y : { x: y };
		var v6 = x ? y : x.y;
	`;

	var results = eslinter.verify( code, linterOptions.parensOnlyObject );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-ternary/parens", "ruleId" );
	assert.strictEqual( messageId, "needParens", "messageId" );
} );

QUnit.test( "PARENS (simple): conforming", function test(assert){
	var code = `
		var v1 = (x) ? (y) : (x) ? (y) : (z);
		var v2 = (x) ? (y) : x == y;
		var v3 = (x) ? (y) : x && y;
		var v4 = (x) ? (y) : foo(x,y);
		var v5 = (x) ? (y) : { x: y };
		var v6 = (x) ? (y) : (x.y);
		var v7 = (x) ? (y) : (\`z\`);
	`;

	var results = eslinter.verify( code, linterOptions.parensOnlySimple );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARENS (simple): violating", function test(assert){
	var code = `
		var v1 = (x) ? (y) : (x) ? (y) : z;
		var v2 = (x) ? (y) : x == y;
		var v3 = (x) ? (y) : x && y;
		var v4 = (x) ? (y) : foo(x,y);
		var v5 = (x) ? (y) : { x: y };
		var v6 = (x) ? (y) : x.y;
		var v7 = (x) ? (y) : \`z\`;
	`;

	var results = eslinter.verify( code, linterOptions.parensOnlySimple );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
		{ ruleId: ruleId3, messageId: messageId3, } = {},
	] = results || [];

	assert.expect( 7 );
	assert.strictEqual( results.length, 3, "only 3 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-ternary/parens", "ruleId1" );
	assert.strictEqual( messageId1, "needParens", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-ternary/parens", "ruleId2" );
	assert.strictEqual( messageId2, "needParens", "messageId2" );
	assert.strictEqual( ruleId3, "@getify/proper-ternary/parens", "ruleId3" );
	assert.strictEqual( messageId3, "needParens", "messageId3" );
} );
