# Require newlines before nested selection sets in Apollo GraphQL queries (graphql-query-nested-newlines)

## Rule Details

Examples of **incorrect** code for this rule:

```js
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
```

Examples of **correct** code for this rule:

```js
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
```
