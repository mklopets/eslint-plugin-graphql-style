# eslint-plugin-graphql-style

Stylistic rules for Apollo GraphQL queries

There's currently just one rule here. It's not great and definitely not recommended yet. But it's kind of cool.


## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `mklopets/eslint-plugin-graphql-style`:

```
$ npm install mklopets/eslint-plugin-graphql-style --D
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install this plugin globally.

## Usage

Add `graphql-style` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "graphql-style"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "graphql-style/rule-name": 2
    }
}
```

## Supported Rules

[graphql-query-nested-newlines](docs/rules/graphql-query-nested-newlines.md)
