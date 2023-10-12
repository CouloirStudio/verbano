describe('Authentication Redirection', () => {
  it('redirects to login page when not logged in', () => {
    cy.visit('localhost:3000/', {
      timeout: 10000,
      failOnStatusCode: true
    });

    cy.location('pathname').should('eq', '/login');
  });

  it('cant access /login when logged in', () => {
    cy.login();
    cy.visit('localhost:3000/login', {
      timeout: 10000,
      failOnStatusCode: true
    });

    cy.location('pathname').should('eq', '/');
  });

  it('cant access /register when logged in', () => {
    cy.login();
    cy.visit('localhost:3000/register', {
      timeout: 10000,
      failOnStatusCode: true
    });

    cy.location('pathname').should('eq', '/');
  });

  it('accessing /logout when logged in redirects to /login', () => {
    cy.login();
    cy.visit('localhost:3000/logout', {
      timeout: 10000,
      failOnStatusCode: true
    });

    cy.location('pathname').should('eq', '/login');
  });

  it('logging out, then accessing the dashboard redirects to /login', () => {
    cy.login();
    cy.visit('localhost:3000/logout', {
      timeout: 10000,
      failOnStatusCode: true
    });

    cy.visit('localhost:3000/', {
      timeout: 10000,
      failOnStatusCode: true
    });

    cy.location('pathname').should('eq', '/login');
  });
});