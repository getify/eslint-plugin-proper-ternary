"use strict";

module.exports = {
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
								context.report({
									node: node,
									messageId: "notHere",
									data: {
										whichClause,
										pattern:
											(whichClause == "test") ? "▁ ? ░░ : ░░" :
											(whichClause == "then") ? "░░ ? ▁ : ░░" :
											"░░ ? ░░ : ▁"
										,
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
				var simpleMode = defaultsOnly || !("simple" in extraOptions) || extraOptions.simple === true;

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
								(["Identifier","MemberExpression","Literal",].includes(clause.type)) ? "simple" :
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
