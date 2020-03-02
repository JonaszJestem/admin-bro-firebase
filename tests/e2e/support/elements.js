export const byId = id => `[data-test=${id}]`;

Cypress.Commands.add("resourcesContains", text => {
  cy.get(byId("page-header")).contains(text);
});
