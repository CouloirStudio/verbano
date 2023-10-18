describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('localhost:3000/register', {
      timeout: 10000,
      failOnStatusCode: true,
    });
  });

  it('should load the page', () => {
    cy.contains('Register');
  });

  it('should have a register button', () => {
    cy.get('#registerButton').should('have.length', 1);
  });

  it('should have login hyperlink', () => {
    cy.contains('Login here!');
  });

  it('should have all fields', () => {
    cy.contains('First Name');
    cy.contains('Last Name');
    cy.contains('Email');
    cy.contains('Password');
  });
});

describe('Input Validation', () => {
  beforeEach(() => {
    cy.visit('localhost:3000/register', {
      timeout: 10000,
      failOnStatusCode: true,
    });
  });

  it('should error on empty first name', () => {
    cy.get('#firstName')
      .invoke('prop', 'validationMessage')
      .should('equal', 'Please fill out this field.');
  });

  it('should error on empty last name', () => {
    cy.get('#lastName')
      .invoke('prop', 'validationMessage')
      .should('equal', 'Please fill out this field.');
  });

  it('should error on empty email', () => {
    cy.get('#email')
      .invoke('prop', 'validationMessage')
      .should('equal', 'Please fill out this field.');
  });

  it('should error on empty password', () => {
    cy.get('#password')
      .invoke('prop', 'validationMessage')
      .should('equal', 'Please fill out this field.');
  });

  it('should error on existing email', () => {
    cy.get('#firstName').type('test');
    cy.get('#lastName').type('test');
    cy.get('#email').type('test@gmail');
    cy.get('#password').type('password');
    cy.get('#registerButton').click();
    cy.contains('Woopsies!');
  });

  it('should error on invalid password', () => {
    cy.get('#firstName').type('test');
    cy.get('#lastName').type('test');
    cy.get('#email').type('test@gmail');
    cy.get('#password').type('short');
    cy.get('#registerButton').click();
    cy.contains('Woopsies!');
  });
});

describe('Account Creation', () => {
  beforeEach(() => {
    cy.visit('localhost:3000/register', {
      timeout: 10000,
      failOnStatusCode: true,
    });
  });

  it('should succeed with valid input', () => {
    cy.intercept('POST', 'http://localhost:3000/graphql', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          data: {
            signup: {
              user: {
                id: 'fakeId123',
                email: 'newaccount@gmail.com',
              },
            },
          },
        },
      });
    });

    cy.get('#firstName').type('test');
    cy.get('#lastName').type('test');
    cy.get('#email').type('test@gmail.com');
    cy.get('#password').type('password123');
    cy.get('#registerButton').click();
    cy.location('pathname').should('eq', '/login'); // Ensure it redirects to login page after successful registration
  });
});
