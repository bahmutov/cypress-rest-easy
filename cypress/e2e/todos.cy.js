/// <reference types="cypress" />

chai.config.truncateThreshold = 0

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

  it('resets the REST response', () => {
    cy.fixture('todos').then((todos) => {
      cy.get('li.todo').should('have.length', todos.length)
    })
  })

  it('sets the resource data in the env object', () => {
    expect(Cypress.env('todos')).to.be.an('array').and.have.length(3)
  })

  it('modifies the data when adding a todo', () => {
    cy.get('input.new-todo').type('Buy milk{enter}')
    cy.wait('@postTodos').then(() => {
      expect(Cypress.env('todos'))
        .to.be.an('array')
        .and.have.length(4)
    })

    cy.log('reload the page')
    cy.reload()
    cy.get('li.todo').should('have.length', 4)
  })

  it('allows accessing individual items', () => {
    const todos = Cypress.env('todos')
    cy.get('li.todo').first().find('.destroy').invoke('show').click()
    cy.wait('@deleteTodos')
      .its('response.statusCode')
      .should('eq', 204)
    cy.get('li.todo')
      .should('have.length', 2)
      .then(() => {
        // the same dats array is modified
        expect(todos).to.be.an('array').and.have.length(2)
      })
  })

  it('supports PATCH', () => {
    cy.get('li.todo').first().find('.toggle').click()
    cy.get('li.todo').first().should('have.class', 'completed')
    cy.wait('@patchTodos')
      .its('response.statusCode')
      .should('eq', 204)
    cy.get('@patchTodos')
      .its('request.body')
      .should('deep.include', {
        completed: true,
      })
      .then(() => {
        const todos = Cypress.env('todos')
        expect(todos, 'todos array')
          .to.be.an('array')
          .and.have.length(3)
        expect(todos[0].completed, 'first todo completed').to.be.true
      })

    cy.log('reload the page')
    cy.reload()
    cy.get('li.todo').first().should('have.class', 'completed')
  })

  it('supports GET /:id', () => {
    const todos = Cypress.env('todos')
    const firstItemId = todos[0].id
    expect(firstItemId, 'first item id').to.be.a('string')
    // perform the request using the same fetch API
    // as the application does which cy.intercept() sees
    cy.window()
      .invokeOnce('fetch', `/todos/${firstItemId}`)
      .as('firstItem')
      .its('status', { timeout: 0 })
      .should('eq', 200)

    cy.log('response body')
    cy.get('@firstItem')
      .invokeOnce('json')
      .should('deep.equal', todos[0])
  })
})
