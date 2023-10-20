describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('localhost:3000/register', {
      timeout: 10000,
      failOnStatusCode: true,
    });
  });

  it('loads correctly', () => {
    cy.visit('localhost:3000/register', {
      timeout: 60000,
      failOnStatusCode: true,
    });
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
    cy.get('[data-cy="firstname-input-field"]').click().should('not.be.empty');
  });

  it('should error on empty last name', () => {
    cy.get('[data-cy="lastname-input-field"]').click().should('not.be.empty');
  });

  it('should error on empty email', () => {
    cy.get('[data-cy="email-input-field"]').click().should('not.be.empty');
  });

  it('should error on empty password', () => {
    cy.get('[data-cy="password-input-field"]').click().should('not.be.empty');
  });

  it('should error on existing email', () => {
    cy.get('[data-cy="firstname-input-field"]').click().type('user');

    cy.get('[data-cy="lastname-input-field"]').click().type('test');

    cy.get('[data-cy="email-input-field"]').click().type('test@gmail.com');

    cy.get('[data-cy="password-input-field"]').click().type('password');

    cy.get('#registerButton').click();

    cy.contains('Invalid Credentials');
  });

  it('should error on invalid password', () => {
    cy.get('[data-cy="firstname-input-field"]').click().type('user');

    cy.get('[data-cy="lastname-input-field"]').click().type('test');

    cy.get('[data-cy="email-input-field"]').click().type('test23@gmail.com');

    cy.get('[data-cy="password-input-field"]').click().type('123');
    cy.get('#registerButton').click();
    cy.contains('Invalid Credentials');
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

    cy.get('[data-cy="firstname-input-field"]').click().type('newUser');

    cy.get('[data-cy="lastname-input-field"]').click().type('newLastName');

    cy.get('[data-cy="email-input-field"]')
      .click()
      .type('newaccount@gmail.com');

    cy.get('[data-cy="password-input-field"]').click().type('password123');

    cy.get('#registerButton').click();

    cy.location('pathname').should('eq', '/login'); // Ensure it redirects to login page after successful registration
  });
});
