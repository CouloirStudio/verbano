describe('Email/Pass Login', () => {
  it('loads correctly', () => {
    cy.visit('localhost:3000/login', {
      timeout: 10000,
      failOnStatusCode: true
    });
  })

  it('logs in successfully', () => {
    cy.visit('localhost:3000/login', {
      timeout: 10000,
      failOnStatusCode: true
    });

    cy.get('#email')
      .type('test@gmail.com').should('have.value', 'test@gmail.com');
    cy.get('#password')
      .type('password').should('have.value', 'password');

    cy.get('#loginButton').click();
    cy.location('pathname').should('eq', '/');
  })

  it('errors on invalid email', () => {
    cy.visit('localhost:3000/login', {
      timeout: 10000,
      failOnStatusCode: true
    });

    cy.get('#email')
      .type('wrong@gmail.com').should('have.value', 'wrong@gmail.com');
    cy.get('#password')
      .type('password').should('have.value', 'password');

    cy.get('#loginButton').click();
    cy.contains('Woopsies!');
  })

  it('errors on invalid password', () => {
    cy.visit('localhost:3000/login', {
      timeout: 10000,
      failOnStatusCode: true
    });

    cy.get('#email')
      .type('test@gmail.com').should('have.value', 'test@gmail.com');
    cy.get('#password')
      .type('wrong').should('have.value', 'wrong');

    cy.get('#loginButton').click();
    cy.contains('Woopsies!');
  })
})

describe('Google Login', () => {
  it('Google button loads', () => {
    cy.visit('localhost:3000/login', {
      timeout: 10000,
      failOnStatusCode: true
    });

    cy.contains("Login with Google");
  })
})