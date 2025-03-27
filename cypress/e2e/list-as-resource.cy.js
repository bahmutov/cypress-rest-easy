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
    })
  },
)
