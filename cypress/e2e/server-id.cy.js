/// <reference types="cypress" />

chai.config.truncateThreshold = 0

describe(
  'Todos with server-side ID',
  { rest: { assignId: true, todos: 'todos.json' } },
  () => {
    beforeEach(() => {
      cy.visit('app-server-id/index.html')
      cy.contains('h1', 'Server ID')
    })

    it('adds and deletes todos with server-side ID', () => {
      cy.wait('@getTodos')
      cy.get('li.todo').should('have.length', 3)

      cy.step('add a todo')
      cy.get('input.new-todo').type('Buy milk{enter}')

      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      cy.wait('@postTodos')
        .its('response.body')
        .should('have.property', 'id')
        .should('be.a', 'string')
        .and('match', uuidRegex)
      cy.get('@postTodos')
        .its('request.body')
        .should('have.keys', ['title', 'completed'])

      cy.get('li.todo').should('have.length', 4)
      cy.contains('li.todo', 'Buy milk').should('exist')
      cy.step('delete the todo')
      cy.get('li.todo').last().find('.destroy').invoke('show').click()
      cy.wait('@deleteTodos')
      cy.get('li.todo').should('have.length', 3)
      cy.contains('li.todo', 'Buy milk').should('not.exist')
    })

    it('spies on crypto.randomUUID', () => {
      const uuid = '9a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d'
      cy.stub(crypto, 'randomUUID').returns(uuid).as('randomUUID')
      cy.get('input.new-todo').type('Buy milk{enter}')

      cy.step('Check the known UUID')
      cy.get('@randomUUID').should('have.been.calledOnce')
      cy.contains('li.todo', 'Buy milk').should(
        'have.attr',
        'data-todo-id',
        uuid,
      )
    })
  },
)
