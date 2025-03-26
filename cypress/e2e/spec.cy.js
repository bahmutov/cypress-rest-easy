/// <reference types="cypress" />

beforeEach(() => {
  cy.log('in the before each')

  // the hook config has resolved values
  // from the declaration in the describe block and the test itself
  expect(Cypress.config('foo')).to.equal('bar')
  expect(Cypress.config('baz')).to.equal('quux')
})

describe(
  'Parent suite',
  { baz: 'quux', foo: 'some other value' },
  () => {
    // overwrite the "foo" config for this test
    it('has the config', { foo: 'bar' }, () => {
      expect(Cypress.config('foo')).to.equal('bar')
      expect(Cypress.config('baz')).to.equal('quux')
    })
  },
)
