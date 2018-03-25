/**
 * @fileoverview Require newlines before nested selection sets in Apollo GraphQL queries.
 * @author Marko K */
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

        function getAstContentByLoc(ast, loc) {
            const { raw } = ast;
            const str = raw.substr(loc.start, loc.end);
            return str.split('\n').map(line => line.trim());
        }

        function validateSelection(selection, ast) {
            const { selectionSet, loc } = selection;
            if (selectionSet) {
                // we only want leaf selections
                // otherwise we'd report bottom level issues
                // on all parent levels, too
                //return;
            }

            const lines = getAstContentByLoc(ast, loc);

            let success;

            let isPreviousLineEmpty = false;
            let isPreviousLineSelectionSetStart = false;
            lines.forEach((line, i) => {
                const isLineSelectionSetStart =
                    line.indexOf('{') > -1 && // look for lines that are the actual starting points of a selection set
                    line.indexOf('}') === -1; // but not ones that also immediately close themselves on the same line

                if (
                    i > 0 && // since the first line doesn't have a previous line that should be left empty, ignore it
                    isLineSelectionSetStart
                ) {
                    if (!isPreviousLineEmpty && !isPreviousLineSelectionSetStart) {
                        success = false;
                    }
                }

                isPreviousLineEmpty = !line;
                isPreviousLineSelectionSetStart = isLineSelectionSetStart;
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

                let hasError = false;

                asts.forEach(ast => {
                    visitSelectionSets(ast, selections => {
                        selections.forEach(selection => {
                            const passedValidation = validateSelection(selection, ast);
                            if (passedValidation === false) {
                                hasError = true;
                            }
                        });
                    });
                });

                if (hasError) {
                    context.report({
                        message: 'Nested selection sets should be preceded by an empty line',
                        node: jsNode
                    });
                }
            }
        };
    }
};
