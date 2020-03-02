import './elements';

beforeEach(() => {
  cy.visit(`${Cypress.env('APP_URL')}/resources/Users`);
  cy.get('div')
    .first()
    .should('not.contain', '404');
});
