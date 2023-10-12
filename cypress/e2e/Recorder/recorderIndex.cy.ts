describe('Record Audio', () => {
  it('loads correctly', () => {
    cy.visit('localhost:3000', {
      timeout: 60000,
      failOnStatusCode: true,
    });
  });

  it('Is ready to record', () => {
    cy.visit('localhost:3000', {
      timeout: 60000,
      failOnStatusCode: true,
    });
    cy.get('#recorderButton').should('have.length', 1);
    cy.get('#recorderButton').should('have.text', 'Start');
  });

  it('Starts Recording', () => {
    cy.visit('localhost:3000', {
      timeout: 60000,
      failOnStatusCode: true,
    });
    cy.get('#recorderButton').should('have.text', 'Start');
    cy.get('#recorderButton').click();
    cy.get('#recorderButton').should('have.text', 'Stop');
    cy.get('#errorTitle').should('not.exist');
  });

  it('Stops Recording', () => {
    cy.visit('localhost:3000', {
      timeout: 60000,
      failOnStatusCode: true,
    });
    // Stubbing so it does not actually upload anything
    cy.intercept('POST', 'http://localhost:3000/audio/upload', {
      statusCode: 200, // 200 OK
      body: {
        success: true,
        message: 'Successfully uploaded.',
      },
    }).as('uploadRequest');
    cy.get('#recorderButton').should('have.text', 'Start');
    cy.get('#recorderButton').click();
    cy.wait(1000);
    cy.get('#recorderButton').should('have.text', 'Stop');
    cy.get('#recorderButton').click();
    cy.wait(1000);
    cy.get('#recorderButton').should('have.text', 'Start');
    cy.get('#errorTitle').should('not.exist');
  });

  it('Renders Error Modal on failed upload', () => {
    cy.visit('localhost:3000', {
      timeout: 60000,
      failOnStatusCode: true,
    });
    cy.intercept('POST', 'http://localhost:3000/audio/upload', {
      statusCode: 500,
      body: {
        success: false,
        message: 'Test',
      },
    }).as('uploadRequest');
    cy.get('#recorderButton').click();
    cy.wait(1000);
    cy.get('#recorderButton').click();
    cy.get('#errorTitle').should('exist');
    cy.get('#errorMessage').should('have.text', 'Test');
  });
});
