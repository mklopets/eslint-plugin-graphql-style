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
                // using a non-gql tag means no linteroo
                query: idk\`
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
                            immediatelyNested {
                                sup
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
        },
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

                                somethingElse {
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
