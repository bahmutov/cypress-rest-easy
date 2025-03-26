# cypress-rest-easy

> Quickly creates REST mocks for your Cypress tests

## Install

```bash
$ npm i -D cypress-rest-easy
```

Add this plugin to your support / spec file

```js
// https://github.com/bahmutov/cypress-rest-easy
import 'cypress-rest-easy'
```

## Use

Declare the REST endpoints in the `describe` / `it` configuration block

```js
describe('Todos', { rest: { todos: 'todos.json' } }, () => {
  // each test will have mock backend with the following endpoints
  // GET /todos
  // POST /todos
  // DELETE /todos/:id
```

See [todos.cy.js](./cypress/e2e/todos.cy.js) for examples

## Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2025

- [@bahmutov](https://twitter.com/bahmutov)
- [glebbahmutov.com](https://glebbahmutov.com)
- [blog](https://glebbahmutov.com/blog)
- [videos](https://www.youtube.com/glebbahmutov)
- [presentations](https://slides.com/bahmutov)
- [cypress.tips](https://cypress.tips)
- [Cypress Tips & Tricks Newsletter](https://cypresstips.substack.com/)
- [my Cypress courses](https://cypress.tips/courses)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/cypress-rest-easy/issues) on Github
