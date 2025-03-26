beforeEach(function prepareRestApi() {
  const rest = Cypress.config('rest')
  if (!rest) {
    return
  }
  console.log(rest)

  Cypress._.each(rest, (fixtureName, resourceName) => {
    cy.fixture(fixtureName).then((data) => {
      // conver the first letter to uppercase
      const resourceNameCapitalized =
        resourceName.charAt(0).toUpperCase() + resourceName.slice(1)
      cy.intercept('GET', resourceName, data).as(
        `get${resourceNameCapitalized}`,
      )
      cy.intercept('POST', resourceName, (req) => {
        req.reply(201, req.body)
      }).as(`post${resourceNameCapitalized}`)
    })
  })
})
