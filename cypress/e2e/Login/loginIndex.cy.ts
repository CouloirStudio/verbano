describe('Email/Pass Login', () => {
  it('loads correctly', () => {
    cy.visit('localhost:3000/login', {
      timeout: 60000,
      failOnStatusCode: true,
    });
  });

  it('logs in successfully', () => {
    cy.visit('localhost:3000/login', {
      timeout: 60000,
      failOnStatusCode: true,
    });

    cy.get('#email')
      .type('test@gmail.com')
      .should('have.value', 'test@gmail.com');
    cy.get('#password').type('password').should('have.value', 'password');

    cy.get('#loginButton').click();
    cy.location('pathname').should('eq', '/');
  });

  it('errors on invalid email', () => {
    cy.visit('localhost:3000/login', {
      timeout: 60000,
      failOnStatusCode: true,
    });

    cy.get('#email')
      .type('wrong@gmail.com')
      .should('have.value', 'wrong@gmail.com');
    cy.get('#password').type('password').should('have.value', 'password');

    cy.get('#loginButton').click();
    cy.contains('Woopsies!');
  });

  it('errors on invalid password', () => {
    cy.visit('localhost:3000/login', {
      timeout: 10000,
      failOnStatusCode: true,
    });

    cy.get('#email')
      .type('test@gmail.com')
      .should('have.value', 'test@gmail.com');
    cy.get('#password').type('wrong').should('have.value', 'wrong');

    cy.get('#loginButton').click();
    cy.contains('Woopsies!');
  });

  it('errors on empty email', () => {
    cy.visit('localhost:3000/login', {
      timeout: 10000,
      failOnStatusCode: true,
    });

    cy.get('#password').type('password').should('have.value', 'password');

    cy.get('#loginButton').click();
    cy.get('#email')
      .invoke('prop', 'validationMessage')
      .should('equal', 'Please fill out this field.');
  });

  it('errors on empty password', () => {
    cy.visit('localhost:3000/login', {
      timeout: 10000,
      failOnStatusCode: true,
    });

    cy.get('#email').type('test@gmail.com');

    cy.get('#loginButton').click();

    cy.get('#password')
      .invoke('prop', 'validationMessage')
      .should('equal', 'Please fill out this field.');
  });
});

it('Register button works', () => {
  cy.visit('localhost:3000/login', {
    timeout: 10000,
    failOnStatusCode: true,
  });
  //get hyperlink element by finding the text
  cy.contains('Register').click();
  cy.location('pathname').should('eq', '/register');
});

describe('Error Handling', () => {
  it('should show an error when ?error= is present', () => {
    cy.visit('localhost:3000/login?error=1', {
      timeout: 10000,
      failOnStatusCode: true,
    });

    cy.contains('Woopsies!');
  });
});

describe('Google Login', () => {
  it('Google button loads', () => {
    cy.visit('localhost:3000/login', {
      timeout: 10000,
      failOnStatusCode: true,
    });

    cy.contains('Login with Google');
  });
});
