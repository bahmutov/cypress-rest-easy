describe('Todos', { rest: { todos: 'todos.json' } }, () => {
  it('deletes the completed todos', () => {
    cy.visit('app/index.html')
    cy.get('li.todo').should('have.length', 3)

    cy.step('complete the first todo')
    cy.get('li.todo').first().find('.toggle').click()
    cy.get('li.todo').first().should('have.class', 'completed')

    cy.step('clear the second todo')
    cy.get('li.todo').eq(1).find('.toggle').click()
    cy.get('li.todo').eq(1).should('have.class', 'completed')

    cy.step('clear the completed todos')
    cy.contains('button', 'Clear completed').click()
    cy.get('[data-cy="remaining-count"]').should('have.text', '1')

    cy.step('confirm 2 DELETE requests were made')
    cy.wait('@deleteTodos')
    cy.wait('@deleteTodos')

    cy.step('confirm "server" data')
    cy.wrap(Cypress.env('todos'))
      .should('be.an', 'array')
      .and('have.length', 1)
      .its(0)
      .should('have.property', 'completed', false)
  })
})
