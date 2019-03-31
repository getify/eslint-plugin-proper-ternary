"use strict";

module.exports = {
	configs: {
		"getify-says": {
			plugins: [ "@getify/proper-ternary", ],
			rules: {
				"@getify/proper-ternary/nested": [ "error", { "else": true, "depth": 10, }, ],
				"@getify/proper-ternary/parens": [ "error", { "ternary": false, "call": false, "object": false, }, ],
				"@getify/proper-ternary/where": [ "error", { "return": false, }, ],
			},
		},
	},
	rules: {
		"nested": {
			meta: {
				type: "problem",
				docs: {
					description: "Control the kind and depth of nesting allowed with ternary/conditional expressions",
					category: "Best Practices",
					url: "https://github.com/getify/eslint-plugin-proper-ternary/#rule-nested",
				},
				schema: [
					{
						type: "object",
						properties: {
							test: {
								type: "boolean",
							},
							then: {
								type: "boolean",
							},
							else: {
								type: "boolean",
							},
							depth: {
								type: "integer",
								min: 1,
							},
						},
					},
				],
				messages: {
					tooDeep: "Ternary expression nested too deeply",
					notHere: "Ternary expression cannot be nested in another ternary expression '{{whichClause}}' clause ({{pattern}})",
				},
			},
			create(context) {
				var defaultsOnly = context.options.length == 0;
				var extraOptions = (!defaultsOnly) ? context.options[0] : null;
				var clauseTest = (!defaultsOnly && extraOptions && extraOptions.test === true);
				var clauseThen = (!defaultsOnly && extraOptions && extraOptions.then === true);
				var clauseElse = (!defaultsOnly && extraOptions && extraOptions.else === true);
				var depthLimit = (defaultsOnly || !("depth" in extraOptions)) ? 1 : extraOptions.depth;

				var ternaryStack = new Map();

				return {
					"ConditionalExpression": function enter(node) {
						var ancestors = context.getAncestors();
						var parentTernary = getOutermostTernary(ancestors);
						if (parentTernary) {
							if (!ternaryStack.has(parentTernary)) {
								ternaryStack.set(parentTernary,[]);
							}
							let stack = ternaryStack.get(parentTernary);
							stack.push(node);

							// handle nested "depth" mode
							if (
								!stack.depthReported &&
								stack.length > depthLimit
							) {
								stack.depthReported = true;
								context.report({
									node: stack[depthLimit],
									messageId: "tooDeep",
								});
							}

							// handle "test" / "then" / "else" clause mode
							let whichClause = identifyParentClause(node,ancestors);
							if (
								(whichClause == "test" && !clauseTest) ||
								(whichClause == "then" && !clauseThen) ||
								(whichClause == "else" && !clauseElse)
							) {
								let pattern =
									(whichClause == "test") ? "▁ ? ░░ : ░░" :
									(whichClause == "then") ? "░░ ? ▁ : ░░" :
									"░░ ? ░░ : ▁";

								context.report({
									node: node,
									messageId: "notHere",
									data: {
										whichClause,
										pattern,
									},
								});
							}
						}
					},
				};
			},
		},
		"parens": {
			meta: {
				type: "problem",
				docs: {
					description: "Require ( .. ) parentheses delimiting for ternary clauses based on the type of expression",
					category: "Best Practices",
					url: "https://github.com/getify/eslint-plugin-proper-ternary/#rule-parens",
				},
				schema: [
					{
						type: "object",
						properties: {
							ternary: {
								type: "boolean",
							},
							comparison: {
								type: "boolean",
							},
							logical: {
								type: "boolean",
							},
							call: {
								type: "boolean",
							},
							object: {
								type: "boolean",
							},
							simple: {
								type: "boolean",
							},
						},
					},
				],
				messages: {
					needParens: "Ternary clause expression requires enclosing ( .. )",
				},
			},
			create(context) {
				var defaultsOnly = context.options.length == 0;
				var extraOptions = (!defaultsOnly) ? context.options[0] : null;
				var ternaryMode = defaultsOnly || !("ternary" in extraOptions) || extraOptions.ternary === true;
				var comparisonMode = defaultsOnly || !("comparison" in extraOptions) || extraOptions.comparison === true;
				var logicalMode = defaultsOnly || !("logical" in extraOptions) || extraOptions.logical === true;
				var callMode = defaultsOnly || !("call" in extraOptions) || extraOptions.call === true;
				var objectMode = defaultsOnly || !("object" in extraOptions) || extraOptions.object === true;
				var simpleMode = (!defaultsOnly && extraOptions && extraOptions.simple === true);

				var sourceCode = context.getSourceCode();

				return {
					"ConditionalExpression": function enter(node) {
						for (let clause of [node.test,node.consequent,node.alternate,]) {
							let exprType =
								(clause.type == "ConditionalExpression") ? "ternary" :
								(clause.type == "BinaryExpression" && ["==","===","!=","!==","<",">","<=",">=","in","instanceof",].includes(clause.operator)) ? "comparison" :
								(clause.type == "LogicalExpression") ? "logical" :
								(clause.type == "UnaryExpression" && clause.operator == "!") ? "logical" :
								(["CallExpression","NewExpression",].includes(clause.type)) ? "call" :
								(["ArrayExpression","ObjectExpression",].includes(clause.type)) ? "object" :
								(["Identifier","MemberExpression","Literal","TemplateLiteral",].includes(clause.type)) ? "simple" :
								"complex";

							if (
								(
									(ternaryMode && exprType == "ternary") ||
									(comparisonMode && exprType == "comparison") ||
									(logicalMode && exprType == "logical") ||
									(callMode && exprType == "call") ||
									(objectMode && exprType == "object") ||
									(simpleMode && exprType == "simple") ||
									exprType == "complex"
								) &&
								!parensSurrounding(sourceCode,clause)
							) {
								context.report({
									node: clause,
									messageId: "needParens",
								});
							}
						}
					},
				};
			},
		},
		"where": {
			meta: {
				type: "problem",
				docs: {
					description: "Restrict where in program structure ternary expressions can be used",
					category: "Best Practices",
					url: "https://github.com/getify/eslint-plugin-proper-ternary/#rule-where",
				},
				schema: [
					{
						type: "object",
						properties: {
							statement: {
								type: "boolean",
							},
							property: {
								type: "boolean",
							},
							argument: {
								type: "boolean",
							},
							return: {
								type: "boolean",
							},
							default: {
								type: "boolean",
							},
							sub: {
								type: "boolean",
							},
							asssignment: {
								type: "boolean",
							},
						},
					},
				],
				messages: {
					notHere: "Ternary expression cannot be used {{usage}}",
				},
			},
			create(context) {
				var defaultsOnly = context.options.length == 0;
				var extraOptions = (!defaultsOnly) ? context.options[0] : null;
				var statementMode = defaultsOnly || !("statement" in extraOptions) || extraOptions.statement === true;
				var propertyMode = defaultsOnly || !("property" in extraOptions) || extraOptions.property === true;
				var argumentMode = defaultsOnly || !("argument" in extraOptions) || extraOptions.argument === true;
				var returnMode = defaultsOnly || !("return" in extraOptions) || extraOptions.return === true;
				var defaultMode = defaultsOnly || !("default" in extraOptions) || extraOptions.default === true;
				var subMode = defaultsOnly || !("sub" in extraOptions) || extraOptions.sub === true;
				var assignmentMode = (!defaultsOnly && extraOptions && extraOptions.assignment === true);

				return {
					"ConditionalExpression": function enter(node) {
						// handle "statement" mode
						if (
							statementMode &&
							node.parent.type == "ExpressionStatement" &&
							node.parent.expression == node
						) {
							context.report({
								node: node,
								messageId: "notHere",
								data: { usage: "as a standalone statement", },
							});
						}

						// handle "property" mode
						if (propertyMode) {
							// object property?
							if (
								node.parent.type == "Property" &&
								node.parent.value == node
							) {
								context.report({
									node: node,
									messageId: "notHere",
									data: { usage: "in an object property", },
								});
							}
							// array value?
							else if (
								node.parent.type == "ArrayExpression" &&
								node.parent.elements.includes(node)
							) {
								context.report({
									node: node,
									messageId: "notHere",
									data: { usage: "in an array element position", },
								});
							}
						}

						// handle "argument" mode
						if (
							argumentMode &&
							["CallExpression","NewExpression",].includes(node.parent.type) &&
							node.parent.arguments.includes(node)
						) {
							context.report({
								node: node,
								messageId: "notHere",
								data: { usage: "as a function call argument", },
							});
						}

						// handle "property" mode
						if (returnMode) {
							// return statement?
							if (
								node.parent.type == "ReturnStatement" &&
								node.parent.argument == node
							) {
								context.report({
									node: node,
									messageId: "notHere",
									data: { usage: "as a function return", },
								});
							}
							// arrow concise return?
							else if (
								node.parent.type == "ArrowFunctionExpression" &&
								node.parent.body == node
							) {
								context.report({
									node: node,
									messageId: "notHere",
									data: { usage: "as a function return", },
								});
							}
						}

						// handle "default" mode
						if (
							defaultMode &&
							node.parent.type == "AssignmentPattern" &&
							node.parent.right == node
						) {
							context.report({
								node: node,
								messageId: "notHere",
								data: { usage: "as a default value assignment", },
							});
						}

						// handle "sub" mode
						if (subMode) {
							// in unary expression?
							if (
								node.parent.type == "UnaryExpression" &&
								node.parent.argument == node
							) {
								context.report({
									node: node,
									messageId: "notHere",
									data: { usage: "in a unary operator expression", },
								});
							}
							// arrow concise return?
							else if (
								node.parent.type == "BinaryExpression" &&
								(
									node.parent.left == node ||
									node.parent.right == node
								)
							) {
								context.report({
									node: node,
									messageId: "notHere",
									data: { usage: "in a binary operator expression", },
								});
							}
						}

						// handle "assignment" mode
						if (assignmentMode) {
							// in a variable declarator?
							if (
								node.parent.type == "VariableDeclarator" &&
								node.parent.init == node
							) {
								context.report({
									node: node,
									messageId: "notHere",
									data: { usage: "in a declaration assignment", },
								});
							}
							// in an assignment?
							else if (
								node.parent.type == "AssignmentExpression" &&
								node.parent.right == node
							) {
								context.report({
									node: node,
									messageId: "notHere",
									data: { usage: "in an assignment", },
								});
							}
						}
					},
				};
			},
		},
	},
};


// ***************************

function parensSurrounding(sourceCode,node) {
	var before = sourceCode.getTokenBefore(node);
	var after = sourceCode.getTokenAfter(node);

	return (
		before &&
		before.type == "Punctuator" &&
		before.value == "(" &&
		after &&
		after.type == "Punctuator" &&
		after.value == ")"
	);
}

function getOutermostTernary(nodes) {
	var ternary;
	for (let node of [...nodes,].reverse()) {
		if (node.type == "ConditionalExpression") {
			ternary = node;
		}
		else if (
			node.type.includes("Statement") ||
			node.type.includes("Declarat") ||
			node.type.includes("Assignment")
		) {
			return ternary;
		}
	}
}

function identifyParentClause(ternary,nodes) {
	var prevNode = ternary;
	for (let node of [...nodes,].reverse()) {
		if (node.type == "ConditionalExpression") {
			if (node.test === prevNode) return "test";
			else if (node.consequent === prevNode) return "then";
			else {
				// NOTE: these contortions/comments here are because of an
				// annoying bug with Istanbul's code coverage:
				// https://github.com/gotwarlost/istanbul/issues/781
				//
				/* eslint-disable no-lonely-if */
				/* istanbul ignore else */
				if (node.alternate === prevNode) {
					return "else";
				}
				/* eslint-enable no-lonely-if */
			}
		}
		prevNode = node;
	}
}
