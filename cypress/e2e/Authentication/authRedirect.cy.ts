describe('Authentication Redirection', () => {
  it('redirects to login page when not logged in', () => {
    cy.visit('localhost:3000/', {
      timeout: 10000,
      failOnStatusCode: true
    });

    cy.location('pathname').should('eq', '/login');
  });
});