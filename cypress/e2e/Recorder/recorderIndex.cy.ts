describe('Record Audio', () => {
  beforeEach(() => {
    cy.login(); // This will ensure the user is logged in before each test in this describe block
  });

  it('loads correctly', () => {
    cy.visit('https://localhost:3000', {
      timeout: 60000,
      failOnStatusCode: true,
    });
  });

  it('Is ready to record', () => {
    cy.visit('https://localhost:3000', {
      timeout: 60000,
      failOnStatusCode: true,
    });
    cy.contains('4CYPRESS').click();
    cy.wait(1000);
    cy.contains('DONOTDELETE').click();
    cy.get('#recordImage').should('be.visible');
  });

  it('Starts Recording', () => {
    cy.visit('https://localhost:3000', {
      timeout: 60000,
      failOnStatusCode: true,
    });
    cy.contains('4CYPRESS').click();
    cy.wait(1000);
    cy.contains('DONOTDELETE').click();
    cy.get('#recordImage').should('be.visible');
    cy.get('#recordButton').click();
    cy.get('#stopImage').should('be.visible');
    cy.get('#errorTitle').should('not.exist');
  });

  it('Stops Recording', () => {
    cy.visit('https://localhost:3000', {
      timeout: 60000,
      failOnStatusCode: true,
    });
    // Stubbing so it does not actually upload anything
    cy.intercept('POST', 'https://localhost:3000/audio/upload', {
      statusCode: 200, // 200 OK
      body: {
        success: true,
        message: 'Successfully uploaded.',
      },
    }).as('uploadRequest');

    cy.contains('4CYPRESS').click();
    cy.wait(1000);
    cy.contains('DONOTDELETE').click();
    cy.get('#recordImage').should('be.visible');
    cy.get('#recordButton').click();
    cy.wait(2000);
    cy.get('#stopImage').should('be.visible');
    cy.get('#recordButton').click();
    cy.wait(2000);
    cy.get('#errorTitle').should('not.exist');
    cy.get('#recordButton').should('be.visible');
    cy.get('#errorTitle').should('not.exist');
  });

  it('Renders Error Modal on failed upload', () => {
    cy.visit('https://localhost:3000', {
      timeout: 60000,
      failOnStatusCode: true,
    });
    cy.intercept('POST', 'https://localhost:3000/audio/upload', {
      statusCode: 500,
      body: {
        success: false,
        message: 'Test',
      },
    }).as('uploadRequest');
    cy.contains('4CYPRESS').click();
    cy.wait(1000);
    cy.contains('DONOTDELETE').click();
    cy.get('#recordImage').should('be.visible');
    cy.get('#recordButton').click();
    cy.wait(2000);
    cy.get('#stopImage').should('be.visible');
    cy.get('#recordButton').click();
    cy.wait(2000);
    cy.get('#errorTitle').should('exist');
    cy.get('#errorMessage').should('have.text', 'Test');
  });
});
