/// <reference types="cypress" />

chai.config.truncateThreshold = 0

describe(
  'Todos with server-side ID',
  {
    rest: {
      assignId: () => '123-abc',
      todos: 'todos.json',
    },
  },
  () => {
    beforeEach(() => {
      cy.visit('app-server-id/index.html')
      cy.contains('h1', 'Server ID')
    })

    it('uses custom stub to create server id', () => {
      cy.get('input.new-todo').type('Buy milk{enter}')

      cy.step('Check the created UUID')
      cy.contains('li.todo', 'Buy milk').should(
        'have.attr',
        'data-todo-id',
        '123-abc',
      )
    })
  },
)
