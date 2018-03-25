"use strict";

const rule = require("../../../lib/rules/graphql-query-nested-newlines");
const RuleTester = require("eslint").RuleTester;

RuleTester.setDefaultConfig({
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module"
    }
});

const ruleTester = new RuleTester();
ruleTester.run("graphql-query-nested-newlines", rule, {
    valid: [
        `
            export default {
                query: gql\`
                    {
                        me {
                            id

                            avatar {
                                small
                            }
                        }
                    }
                \`,
                options: {
                    props: ({ data }) => ({
                        user: data.me,
                        isLoading: data.loading
                    })
                }
            };
        `,
        `
            export default {
                query: gql\`
                    {
                        me {
                            id
                            avatar { small }
                        }
                    }
                \`,
                options: {
                    props: ({ data }) => ({
                        user: data.me,
                        isLoading: data.loading
                    })
                }
            };
        `,
        `
            export default {
                query: gql\`
                    {
                        me {
                            avatar {
                                small
                            }
                        }
                    }
                \`,
                options: {
                    props: ({ data }) => ({
                        user: data.me,
                        isLoading: data.loading
                    })
                }
            };
        `
    ],

    invalid: [
        {
            code: `
                export default {
                    query: gql\`
                        {
                            me {
                                id
                                avatar {
                                    small
                                }
                            }
                        }
                    \`,
                    options: {
                        props: ({ data }) => ({
                            user: data.me,
                            isLoading: data.loading
                        })
                    }
                };
            `,
            errors: [{
                message: "Nested selection sets should be preceded by an empty line",
                type: "TaggedTemplateExpression"
            }]
        }
    ]
});
