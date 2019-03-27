"use strict";

var linterOptions = {
	whereDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/where": "error", },
	},
	whereEmptyOptions: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/where": [ "error", {}, ], },
	},
	whereAllOff: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/where": [ "error", { statement: false, property: false, argument: false, return: false, default: false, sub: false, assignment: false, }, ], },
	},
	whereOnlyStatement: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/where": [ "error", { statement: true, property: false, argument: false, return: false, default: false, sub: false, assignment: false, }, ], },
	},
	whereOnlyProperty: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/where": [ "error", { statement: false, property: true, argument: false, return: false, default: false, sub: false, assignment: false, }, ], },
	},
	whereOnlyArgument: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/where": [ "error", { statement: false, property: false, argument: true, return: false, default: false, sub: false, assignment: false, }, ], },
	},
	whereOnlyReturn: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/where": [ "error", { statement: false, property: false, argument: false, return: true, default: false, sub: false, assignment: false, }, ], },
	},
	whereOnlyDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/where": [ "error", { statement: false, property: false, argument: false, return: false, default: true, sub: false, assignment: false, }, ], },
	},
	whereOnlySub: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/where": [ "error", { statement: false, property: false, argument: false, return: false, default: false, sub: true, assignment: false, }, ], },
	},
	whereOnlyAssignment: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-ternary/where": [ "error", { statement: false, property: false, argument: false, return: false, default: false, sub: false, assignment: true, }, ], },
	},
};

QUnit.test( "WHERE (default): conforming", function test(assert){
	var code = `
		var v = x ? y : z;
		v = x ? y : z;
	`;

	var results = eslinter.verify( code, linterOptions.whereDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "WHERE (default): violating", function test(assert){
	var code = `
		x ? y : z;
		var o = { p: x ? y : z };
		var a = [ x ? y : z ];
		foo( x ? y : z );
		function foo() { return x ? y : z; }
		foo = () => x ? y : z;
		function bar(p = x ? y : z) {}
		[ v = x ? y : z ] = arr;
		!(x ? y : z);
		1 + (x ? y : z);
		(x ? y : z) + 1;
		var v = x ? y : z;
		v = x ? y : z;
	`;

	var results = eslinter.verify( code, linterOptions.whereDefault );
	var [
		{ ruleId: ruleId1, messageId: messageId1, message: message1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, message: message2, } = {},
		{ ruleId: ruleId3, messageId: messageId3, message: message3, } = {},
		{ ruleId: ruleId4, messageId: messageId4, message: message4, } = {},
		{ ruleId: ruleId5, messageId: messageId5, message: message5, } = {},
		{ ruleId: ruleId6, messageId: messageId6, message: message6, } = {},
		{ ruleId: ruleId7, messageId: messageId7, message: message7, } = {},
		{ ruleId: ruleId8, messageId: messageId8, message: message8, } = {},
		{ ruleId: ruleId9, messageId: messageId9, message: message9, } = {},
		{ ruleId: ruleId10, messageId: messageId10, message: message10, } = {},
		{ ruleId: ruleId11, messageId: messageId11, message: message11, } = {},
	] = results || [];

	assert.expect( 34 );
	assert.strictEqual( results.length, 11, "only 11 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-ternary/where", "ruleId1" );
	assert.strictEqual( messageId1, "notHere", "messageId1" );
	assert.ok( message1.includes("standalone statement"), "message1" );
	assert.strictEqual( ruleId2, "@getify/proper-ternary/where", "ruleId2" );
	assert.strictEqual( messageId2, "notHere", "messageId2" );
	assert.ok( message2.includes("object property"), "message2" );
	assert.strictEqual( ruleId3, "@getify/proper-ternary/where", "ruleId3" );
	assert.strictEqual( messageId3, "notHere", "messageId3" );
	assert.ok( message3.includes("array element"), "message3" );
	assert.strictEqual( ruleId4, "@getify/proper-ternary/where", "ruleId4" );
	assert.strictEqual( messageId4, "notHere", "messageId4" );
	assert.ok( message4.includes("call argument"), "message4" );
	assert.strictEqual( ruleId5, "@getify/proper-ternary/where", "ruleId5" );
	assert.strictEqual( messageId5, "notHere", "messageId5" );
	assert.ok( message5.includes("function return"), "message5" );
	assert.strictEqual( ruleId6, "@getify/proper-ternary/where", "ruleId6" );
	assert.strictEqual( messageId6, "notHere", "messageId6" );
	assert.ok( message6.includes("function return"), "message6" );
	assert.strictEqual( ruleId7, "@getify/proper-ternary/where", "ruleId7" );
	assert.strictEqual( messageId7, "notHere", "messageId7" );
	assert.ok( message7.includes("default value"), "message7" );
	assert.strictEqual( ruleId8, "@getify/proper-ternary/where", "ruleId8" );
	assert.strictEqual( messageId8, "notHere", "messageId8" );
	assert.ok( message8.includes("default value"), "message8" );
	assert.strictEqual( ruleId9, "@getify/proper-ternary/where", "ruleId9" );
	assert.strictEqual( messageId9, "notHere", "messageId9" );
	assert.ok( message9.includes("unary"), "message9" );
	assert.strictEqual( ruleId10, "@getify/proper-ternary/where", "ruleId10" );
	assert.strictEqual( messageId10, "notHere", "messageId10" );
	assert.ok( message10.includes("binary"), "message10" );
	assert.strictEqual( ruleId11, "@getify/proper-ternary/where", "ruleId11" );
	assert.strictEqual( messageId11, "notHere", "messageId11" );
	assert.ok( message11.includes("binary"), "message11" );
} );

QUnit.test( "WHERE (empty options): violating", function test(assert){
	var code = `
		x ? y : z;
		var o = { p: x ? y : z };
		var a = [ x ? y : z ];
		foo( x ? y : z );
		function foo() { return x ? y : z; }
		foo = () => x ? y : z;
		function bar(p = x ? y : z) {}
		[ v = x ? y : z ] = arr;
		!(x ? y : z);
		1 + (x ? y : z);
		(x ? y : z) + 1;
		var v = x ? y : z;
		v = x ? y : z;
	`;

	var results = eslinter.verify( code, linterOptions.whereEmptyOptions );
	var [
		{ ruleId: ruleId1, messageId: messageId1, message: message1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, message: message2, } = {},
		{ ruleId: ruleId3, messageId: messageId3, message: message3, } = {},
		{ ruleId: ruleId4, messageId: messageId4, message: message4, } = {},
		{ ruleId: ruleId5, messageId: messageId5, message: message5, } = {},
		{ ruleId: ruleId6, messageId: messageId6, message: message6, } = {},
		{ ruleId: ruleId7, messageId: messageId7, message: message7, } = {},
		{ ruleId: ruleId8, messageId: messageId8, message: message8, } = {},
		{ ruleId: ruleId9, messageId: messageId9, message: message9, } = {},
		{ ruleId: ruleId10, messageId: messageId10, message: message10, } = {},
		{ ruleId: ruleId11, messageId: messageId11, message: message11, } = {},
	] = results || [];

	assert.expect( 34 );
	assert.strictEqual( results.length, 11, "only 11 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-ternary/where", "ruleId1" );
	assert.strictEqual( messageId1, "notHere", "messageId1" );
	assert.ok( message1.includes("standalone statement"), "message1" );
	assert.strictEqual( ruleId2, "@getify/proper-ternary/where", "ruleId2" );
	assert.strictEqual( messageId2, "notHere", "messageId2" );
	assert.ok( message2.includes("object property"), "message2" );
	assert.strictEqual( ruleId3, "@getify/proper-ternary/where", "ruleId3" );
	assert.strictEqual( messageId3, "notHere", "messageId3" );
	assert.ok( message3.includes("array element"), "message3" );
	assert.strictEqual( ruleId4, "@getify/proper-ternary/where", "ruleId4" );
	assert.strictEqual( messageId4, "notHere", "messageId4" );
	assert.ok( message4.includes("call argument"), "message4" );
	assert.strictEqual( ruleId5, "@getify/proper-ternary/where", "ruleId5" );
	assert.strictEqual( messageId5, "notHere", "messageId5" );
	assert.ok( message5.includes("function return"), "message5" );
	assert.strictEqual( ruleId6, "@getify/proper-ternary/where", "ruleId6" );
	assert.strictEqual( messageId6, "notHere", "messageId6" );
	assert.ok( message6.includes("function return"), "message6" );
	assert.strictEqual( ruleId7, "@getify/proper-ternary/where", "ruleId7" );
	assert.strictEqual( messageId7, "notHere", "messageId7" );
	assert.ok( message7.includes("default value"), "message7" );
	assert.strictEqual( ruleId8, "@getify/proper-ternary/where", "ruleId8" );
	assert.strictEqual( messageId8, "notHere", "messageId8" );
	assert.ok( message8.includes("default value"), "message8" );
	assert.strictEqual( ruleId9, "@getify/proper-ternary/where", "ruleId9" );
	assert.strictEqual( messageId9, "notHere", "messageId9" );
	assert.ok( message9.includes("unary"), "message9" );
	assert.strictEqual( ruleId10, "@getify/proper-ternary/where", "ruleId10" );
	assert.strictEqual( messageId10, "notHere", "messageId10" );
	assert.ok( message10.includes("binary"), "message10" );
	assert.strictEqual( ruleId11, "@getify/proper-ternary/where", "ruleId11" );
	assert.strictEqual( messageId11, "notHere", "messageId11" );
	assert.ok( message11.includes("binary"), "message11" );
} );

QUnit.test( "WHERE (all off): conforming", function test(assert){
	var code = `
		x ? y : z;
		var o = { p: x ? y : z };
		var a = [ x ? y : z ];
		foo( x ? y : z );
		function foo() { return x ? y : z; }
		foo = () => x ? y : z;
		function bar(p = x ? y : z) {}
		[ v = x ? y : z ] = arr;
		!(x ? y : z);
		1 + (x ? y : z);
		(x ? y : z) + 1;
		var v = x ? y : z;
		v = x ? y : z;
	`;

	var results = eslinter.verify( code, linterOptions.whereAllOff );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "WHERE (statement): violating", function test(assert){
	var code = `
		x ? y : z;
		var o = { p: x ? y : z };
		var a = [ x ? y : z ];
		foo( x ? y : z );
		function foo() { return x ? y : z; }
		foo = () => x ? y : z;
		function bar(p = x ? y : z) {}
		[ v = x ? y : z ] = arr;
		!(x ? y : z);
		1 + (x ? y : z);
		(x ? y : z) + 1;
		var v = x ? y : z;
		v = x ? y : z;
	`;

	var results = eslinter.verify( code, linterOptions.whereOnlyStatement );
	var [{ ruleId, messageId, message, } = {},] = results || [];

	assert.expect( 4 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-ternary/where", "ruleId" );
	assert.strictEqual( messageId, "notHere", "messageId" );
	assert.ok( message.includes("standalone statement"), "message" );
} );

QUnit.test( "WHERE (property): violating", function test(assert){
	var code = `
		x ? y : z;
		var o = { p: x ? y : z };
		var a = [ x ? y : z ];
		foo( x ? y : z );
		function foo() { return x ? y : z; }
		foo = () => x ? y : z;
		function bar(p = x ? y : z) {}
		[ v = x ? y : z ] = arr;
		!(x ? y : z);
		1 + (x ? y : z);
		(x ? y : z) + 1;
		var v = x ? y : z;
		v = x ? y : z;
	`;

	var results = eslinter.verify( code, linterOptions.whereOnlyProperty );
	var [
		{ ruleId: ruleId1, messageId: messageId1, message: message1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, message: message2, } = {},
	] = results || [];

	assert.expect( 7 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-ternary/where", "ruleId1" );
	assert.strictEqual( messageId1, "notHere", "messageId1" );
	assert.ok( message1.includes("object property"), "message1" );
	assert.strictEqual( ruleId2, "@getify/proper-ternary/where", "ruleId2" );
	assert.strictEqual( messageId2, "notHere", "messageId2" );
	assert.ok( message2.includes("array element"), "message2" );
} );

QUnit.test( "WHERE (argument): violating", function test(assert){
	var code = `
		x ? y : z;
		var o = { p: x ? y : z };
		var a = [ x ? y : z ];
		foo( x ? y : z );
		function foo() { return x ? y : z; }
		foo = () => x ? y : z;
		function bar(p = x ? y : z) {}
		[ v = x ? y : z ] = arr;
		!(x ? y : z);
		1 + (x ? y : z);
		(x ? y : z) + 1;
		var v = x ? y : z;
		v = x ? y : z;
	`;

	var results = eslinter.verify( code, linterOptions.whereOnlyArgument );
	var [{ ruleId, messageId, message, } = {},] = results || [];

	assert.expect( 4 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-ternary/where", "ruleId" );
	assert.strictEqual( messageId, "notHere", "messageId" );
	assert.ok( message.includes("call argument"), "message" );
} );

QUnit.test( "WHERE (return): violating", function test(assert){
	var code = `
		x ? y : z;
		var o = { p: x ? y : z };
		var a = [ x ? y : z ];
		foo( x ? y : z );
		function foo() { return x ? y : z; }
		foo = () => x ? y : z;
		function bar(p = x ? y : z) {}
		[ v = x ? y : z ] = arr;
		!(x ? y : z);
		1 + (x ? y : z);
		(x ? y : z) + 1;
		var v = x ? y : z;
		v = x ? y : z;
	`;

	var results = eslinter.verify( code, linterOptions.whereOnlyReturn );
	var [
		{ ruleId: ruleId1, messageId: messageId1, message: message1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, message: message2, } = {},
	] = results || [];

	assert.expect( 7 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-ternary/where", "ruleId1" );
	assert.strictEqual( messageId1, "notHere", "messageId1" );
	assert.ok( message1.includes("function return"), "message1" );
	assert.strictEqual( ruleId2, "@getify/proper-ternary/where", "ruleId2" );
	assert.strictEqual( messageId2, "notHere", "messageId2" );
	assert.ok( message2.includes("function return"), "message2" );
} );

QUnit.test( "WHERE (default): violating", function test(assert){
	var code = `
		x ? y : z;
		var o = { p: x ? y : z };
		var a = [ x ? y : z ];
		foo( x ? y : z );
		function foo() { return x ? y : z; }
		foo = () => x ? y : z;
		function bar(p = x ? y : z) {}
		[ v = x ? y : z ] = arr;
		!(x ? y : z);
		1 + (x ? y : z);
		(x ? y : z) + 1;
		var v = x ? y : z;
		v = x ? y : z;
	`;

	var results = eslinter.verify( code, linterOptions.whereOnlyDefault );
	var [
		{ ruleId: ruleId1, messageId: messageId1, message: message1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, message: message2, } = {},
	] = results || [];

	assert.expect( 7 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-ternary/where", "ruleId1" );
	assert.strictEqual( messageId1, "notHere", "messageId1" );
	assert.ok( message1.includes("default value"), "message1" );
	assert.strictEqual( ruleId2, "@getify/proper-ternary/where", "ruleId2" );
	assert.strictEqual( messageId2, "notHere", "messageId2" );
	assert.ok( message2.includes("default value"), "message2" );
} );

QUnit.test( "WHERE (sub): violating", function test(assert){
	var code = `
		x ? y : z;
		var o = { p: x ? y : z };
		var a = [ x ? y : z ];
		foo( x ? y : z );
		function foo() { return x ? y : z; }
		foo = () => x ? y : z;
		function bar(p = x ? y : z) {}
		[ v = x ? y : z ] = arr;
		!(x ? y : z);
		1 + (x ? y : z);
		(x ? y : z) + 1;
		var v = x ? y : z;
		v = x ? y : z;
	`;

	var results = eslinter.verify( code, linterOptions.whereOnlySub );
	var [
		{ ruleId: ruleId1, messageId: messageId1, message: message1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, message: message2, } = {},
		{ ruleId: ruleId3, messageId: messageId3, message: message3, } = {},
	] = results || [];

	assert.expect( 10 );
	assert.strictEqual( results.length, 3, "only 3 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-ternary/where", "ruleId1" );
	assert.strictEqual( messageId1, "notHere", "messageId1" );
	assert.ok( message1.includes("unary"), "message1" );
	assert.strictEqual( ruleId2, "@getify/proper-ternary/where", "ruleId2" );
	assert.strictEqual( messageId2, "notHere", "messageId2" );
	assert.ok( message2.includes("binary"), "message2" );
	assert.strictEqual( ruleId3, "@getify/proper-ternary/where", "ruleId3" );
	assert.strictEqual( messageId3, "notHere", "messageId3" );
	assert.ok( message3.includes("binary"), "message3" );
} );

QUnit.test( "WHERE (assignment): violating", function test(assert){
	var code = `
		x ? y : z;
		var o = { p: x ? y : z };
		var a = [ x ? y : z ];
		foo( x ? y : z );
		function foo() { return x ? y : z; }
		foo = () => x ? y : z;
		function bar(p = x ? y : z) {}
		[ v = x ? y : z ] = arr;
		!(x ? y : z);
		1 + (x ? y : z);
		(x ? y : z) + 1;
		var v = x ? y : z;
		v = x ? y : z;
	`;

	var results = eslinter.verify( code, linterOptions.whereOnlyAssignment );
	var [
		{ ruleId: ruleId1, messageId: messageId1, message: message1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, message: message2, } = {},
	] = results || [];

	assert.expect( 7 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-ternary/where", "ruleId1" );
	assert.strictEqual( messageId1, "notHere", "messageId1" );
	assert.ok( message1.includes("assignment"), "message1" );
	assert.strictEqual( ruleId2, "@getify/proper-ternary/where", "ruleId2" );
	assert.strictEqual( messageId2, "notHere", "messageId2" );
	assert.ok( message2.includes("assignment"), "message2" );
} );
