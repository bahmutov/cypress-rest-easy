beforeEach(function prepareRestApi() {
  const rest = Cypress.config('rest')
  if (!rest) {
    return
  }

  const baseUrl = rest.baseUrl || ''
  const assignId = rest.assignId || false

  const optionNames = ['baseUrl', 'assignId']

  Cypress._.each(rest, (fixtureName, resourceName) => {
    if (optionNames.includes(resourceName)) {
      // skip system options
      return
    }

    const resourcePrefix = baseUrl
      ? `${baseUrl}/${resourceName}`
      : resourceName

    cy.fixture(fixtureName).then((data) => {
      // store the reference to the data in the Cypress env object
      Cypress.env(resourceName, data)

      // conver the first letter to uppercase
      const resourceNameCapitalized =
        resourceName.charAt(0).toUpperCase() + resourceName.slice(1)

      // GET resources
      cy.intercept('GET', resourcePrefix, (req) =>
        req.reply(200, data),
      ).as(`get${resourceNameCapitalized}`)

      // add GET /:id
      cy.intercept('GET', resourcePrefix + '/*', (req) => {
        const id = req.url.split('/').pop()
        const item = data.find((item) => item.id === id)
        if (!item) {
          return req.reply(404)
        }
        req.reply(200, item)
      }).as(`get${resourceNameCapitalized}ById`)

      // POST resources
      cy.intercept('POST', resourcePrefix, (req) => {
        const item = structuredClone(req.body)
        // modify the id?
        if (assignId && !('id' in item)) {
          if (assignId === true) {
            item.id = crypto.randomUUID()
          } else if (typeof assignId === 'function') {
            item.id = assignId()
          } else {
            throw new Error('assignId has invalid value')
          }
        }
        data.push(item)
        req.reply(201, item)
      }).as(`post${resourceNameCapitalized}`)

      cy.intercept('DELETE', resourcePrefix + '/*', (req) => {
        const id = req.url.split('/').pop()
        // modify the dats in place so that any existing
        // array references will see the change
        const index = data.findIndex((item) => item.id === id)
        if (index !== -1) {
          data.splice(index, 1)
        }
        req.reply(204)
      }).as(`delete${resourceNameCapitalized}`)

      // PATCH resources
      cy.intercept('PATCH', resourcePrefix + '/*', (req) => {
        const id = req.url.split('/').pop()
        const index = data.findIndex((item) => item.id === id)
        if (index === -1) {
          return req.reply(404)
        }
        if (index >= data.length) {
          return req.reply(404)
        }

        Object.assign(data[index], req.body)
        req.reply(204)
      }).as(`patch${resourceNameCapitalized}`)
    })
  })
})
