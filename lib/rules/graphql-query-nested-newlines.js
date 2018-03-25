/**
 * @fileoverview Require newlines before nested selection sets in Apollo GraphQL queries.
 * @author Marko K
 */
"use strict";

const graphqlUtils = require('graphql/language');
const { parse, visit } = graphqlUtils;

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "Require newlines before nested selection sets in Apollo GraphQL queries.",
            category: "Stylistic Issues",
            recommended: true
        }
    },

    create: function(context) {
        function getGraphQLASTs(templateLiteral) {
            const { quasis } = templateLiteral;
            return quasis.map(quasi => {
                const { value } = quasi;
                const { raw } = value;
                return {
                    ...parse(raw),
                    raw
                };
            });
        }

        function visitSelectionSets(ast, fn) {
            visit(ast, {
                enter(node) {
                    const { kind } = node;
                    if (kind === 'SelectionSet') {
                        return fn(node.selections);
                    }
                }
            })
        }

        function validateSelection(selection, ast) {
            const { selectionSet, loc } = selection;
            if (selectionSet) {
                // we only want leaf selections
                // otherwise we'd report bottom level issues
                // on all parent levels, too
                return;
            }
            const { raw } = ast;
            const str = raw.substr(loc.start, loc.end);
            const lines = str.split('\n').map(line => line.trim());
            let success;

            let isLastLineEmpty = false;
            lines.forEach((line, i) => {
                if (i > 0 && line.indexOf('{') > -1 && line.indexOf('}') === -1) {
                    if (!isLastLineEmpty) {
                        success = false;
                    }
                }
                isLastLineEmpty = !line;
            });

            return success;
        }

        // Public
        return {
            TaggedTemplateExpression: (jsNode) => {
                const { tag, quasi } = jsNode;

                if (tag.name !== 'gql') {
                    return;
                }

                const asts = getGraphQLASTs(quasi);

                asts.forEach(ast => {
                    visitSelectionSets(ast, selections => {
                        selections.forEach(selection => {
                            const passedValidation = validateSelection(selection, ast);
                            if (passedValidation === false) {
                                context.report({
                                    message: 'Nested selection sets should be preceded by an empty line',
                                    node: jsNode
                                })
                            }
                        })
                    })
                })
            }
        };
    }
};
