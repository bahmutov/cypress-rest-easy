/// <reference types="cypress" />

describe('Todos', { rest: { todos: 'todos.json' } }, () => {
  beforeEach(() => {
    cy.visit('app/index.html')
  })

  it('has 3 todos', () => {
    cy.wait('@getTodos')
    cy.get('li.todo').should('have.length', 3)
  })

  it('can add a todo', () => {
    cy.get('input.new-todo').type('Buy milk{enter}')
    // verify the REST response
    cy.wait('@postTodos').its('response.statusCode').should('eq', 201)
    cy.get('@postTodos')
      .its('response.body')
      .should('deep.include', {
        title: 'Buy milk',
        completed: false,
      })
      .and('have.property', 'id')
      .should('be.a', 'string')
    cy.get('li.todo').should('have.length', 4)
  })
})
