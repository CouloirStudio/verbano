describe('Current User Data', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should loads correctly', () => {
    cy.visit('localhost:3000/settings/profile', {
      timeout: 60000,
      failOnStatusCode: true,
    });
  });

  it('should display current user data', () => {
    cy.visit('localhost:3000/settings/profile', {
      timeout: 60000,
      failOnStatusCode: true,
    });

    cy.contains('test@gmail.com');
  });
});