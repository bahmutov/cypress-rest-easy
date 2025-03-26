beforeEach(function prepareRestApi() {
  const rest = Cypress.config('rest')
  if (!rest) {
    return
  }

  Cypress._.each(rest, (fixtureName, resourceName) => {
    cy.fixture(fixtureName).then((data) => {
      // store the reference to the data in the Cypress env object
      Cypress.env(resourceName, data)

      // conver the first letter to uppercase
      const resourceNameCapitalized =
        resourceName.charAt(0).toUpperCase() + resourceName.slice(1)
      cy.intercept('GET', resourceName, data).as(
        `get${resourceNameCapitalized}`,
      )
      cy.intercept('POST', resourceName, (req) => {
        const item = req.body
        // modify the id?
        data.push(item)
        req.reply(201, item)
      }).as(`post${resourceNameCapitalized}`)

      cy.intercept('DELETE', resourceName + '/*', (req) => {
        const id = req.url.split('/').pop()
        // modify the dats in place so that any existing
        // array references will see the change
        const index = data.findIndex((item) => item.id === id)
        if (index !== -1) {
          data.splice(index, 1)
        }
        req.reply(204)
      }).as(`delete${resourceNameCapitalized}`)
    })
  })
})
