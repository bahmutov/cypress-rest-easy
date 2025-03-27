/// <reference types="cypress" />

chai.config.truncateThreshold = 0

describe(
  'REST from a list',
  {
    rest: {
      assignId: true,
      todos: [
        {
          id: '101-102-103',
          title: 'First item',
          completed: true,
        },
      ],
    },
  },
  () => {
    beforeEach(() => {
      cy.visit('app-server-id/index.html')
      cy.contains('h1', 'Server ID')
      cy.get('.loaded')
    })

    it('shows the list', () => {
      cy.get('li.todo').should('have.length', 1)
      cy.get('li.todo')
        .first()
        .should('contain', 'First item')
        .and('have.attr', 'data-todo-id', '101-102-103')
        .and('have.class', 'completed')

      cy.step('Add a new item')
      cy.get('input.new-todo').type('Buy milk{enter}')

      cy.get('li.todo').should('have.length', 2)
      cy.get('li.todo').last().should('contain', 'Buy milk')
    })

    it('shows the original list', () => {
      cy.get('li.todo').should('have.length', 1)
      cy.get('li.todo').first().should('contain', 'First item')
    })
  },
)
