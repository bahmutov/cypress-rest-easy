/// <reference types="cypress" />

chai.config.truncateThreshold = 0

describe(
  'Todos with base URL',
  { rest: { baseUrl: '/api/v1', todos: 'todos.json' } },
  () => {
    beforeEach(() => {
      cy.visit('app-base-url/index.html')
      cy.contains('h1', 'base URL')
    })

    it('adds and deletes todos', () => {
      cy.wait('@getTodos')
      cy.get('li.todo').should('have.length', 3)

      cy.step('add a todo')
      cy.get('input.new-todo').type('Buy milk{enter}')
      cy.wait('@postTodos')
      cy.get('li.todo').should('have.length', 4)
      cy.contains('li.todo', 'Buy milk').should('exist')
      cy.step('delete the todo')
      cy.get('li.todo').last().find('.destroy').invoke('show').click()
      cy.wait('@deleteTodos')
      cy.get('li.todo').should('have.length', 3)
      cy.contains('li.todo', 'Buy milk').should('not.exist')
    })
  },
)
