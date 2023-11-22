describe('Email/Pass Login', () => {
  it('loads correctly', () => {
    cy.visit('https://localhost:3000/login', {
      timeout: 60000,
      failOnStatusCode: true,
    });
  });

  it('logs in successfully', () => {
    cy.visit('https://localhost:3000/login', {
      timeout: 60000,
      failOnStatusCode: true,
    });

    cy.get('[data-cy="username-input-field"]')
      .click() // Focus on the TextField
      .type('test@gmail.com'); // Type into the TextField

    cy.get('[data-cy="password-input-field"]').click().type('password');

    cy.get('#loginButton').click();

    cy.location('pathname').should('eq', '/');
  });

  it('errors on invalid email', () => {
    cy.visit('https://localhost:3000/login', {
      timeout: 60000,
      failOnStatusCode: true,
    });

    cy.get('[data-cy="username-input-field"]').click().type('wrong@gmail.com');

    cy.get('[data-cy="password-input-field"]').click().type('password');

    cy.get('#loginButton').click();
    cy.contains('Invalid credentials.');
  });

  it('errors on invalid password', () => {
    cy.visit('https://localhost:3000/login', {
      timeout: 10000,
      failOnStatusCode: true,
    });

    cy.get('[data-cy="username-input-field"]').click().type('test@gmail.com');

    cy.get('[data-cy="password-input-field"]').click().type('wrongpassword');

    cy.get('#loginButton').click();
    cy.contains('Invalid credentials.');
  });

  it('errors on empty email', () => {
    cy.visit('https://localhost:3000/login', {
      timeout: 10000,
      failOnStatusCode: true,
    });

    cy.get('[data-cy="username-input-field"]').click().should('not.be.empty');

    cy.get('[data-cy="password-input-field"]').click().type('password');

    cy.get('#loginButton').click();
  });

  it('errors on empty password', () => {
    cy.visit('https://localhost:3000/login', {
      timeout: 10000,
      failOnStatusCode: true,
    });

    cy.get('[data-cy="username-input-field"]').click().type('test@gmail.com');

    cy.get('[data-cy="password-input-field"]').click().should('not.be.empty');

    cy.get('#loginButton').click();
  });
});

it('Register button works', () => {
  cy.visit('https://localhost:3000/login', {
    timeout: 10000,
    failOnStatusCode: true,
  });
  //get hyperlink element by finding the text
  cy.contains('Register').click();
  cy.location('pathname').should('eq', '/register');
});

describe('Google Login', () => {
  it('Google button loads', () => {
    cy.visit('https://localhost:3000/login', {
      timeout: 10000,
      failOnStatusCode: true,
    });

    cy.contains('Login with Google');
  });
});
