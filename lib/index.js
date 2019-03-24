"use strict";

module.exports = {
	rules: {
		"nested": {
			meta: {
				type: "problem",
				docs: {
					description: "Control the amount and kind of nesting allowed with ternary/conditional expressions",
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
							parens: {
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
					needParens: "Ternary expression cannot be nested without enclosing ( .. )",
				},
			},
			create(context) {
				var defaultsOnly = context.options.length == 0;
				var extraOptions = !defaultsOnly ? context.options[0] : null;
				var clauseTest = (!defaultsOnly && extraOptions && extraOptions.test === true);
				var clauseThen = (!defaultsOnly && extraOptions && extraOptions.then === true);
				var clauseElse = (!defaultsOnly && extraOptions && extraOptions.else === true);
				var parensReq = defaultsOnly || !("parens" in extraOptions) || extraOptions.parens === true;
				var depthLimit = (defaultsOnly || !("depth" in extraOptions)) ? 1 : extraOptions.depth;

				var sourceCode = context.getSourceCode();
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
											whichClause == "test" ? "▁ ? ░░ : ░░" :
											whichClause == "then" ? "░░ ? ▁ : ░░" :
											"░░ ? ░░ : ▁"
										,
									},
								});
							}

							// handle "parens required" mode
							let before = sourceCode.getTokenBefore(node);
							let after = sourceCode.getTokenAfter(node);

							if (!(
								before &&
								before.type == "Punctuator" &&
								before.value == "(" &&
								after &&
								after.type == "Punctuator" &&
								after.value == ")"
							)) {
								context.report({
									node: node,
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
