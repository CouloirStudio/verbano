describe('Profile Page', () => {
  beforeEach(() => {
    cy.login(); // Ensure the user is logged in before each test
    cy.visit('localhost:3000/settings/profile'); // Navigate to the profile page
  });

  it('loads correctly', () => {
    cy.visit('localhost:3000/settings/profile', {
      timeout: 60000,
      failOnStatusCode: true,
    });
  });

  it('should update full name', () => {
    // Type new first and last names in the UpdateFullName component
    cy.get('[data-cy="first-name"] input')
      .click()
      .clear()
      .type('New First Name');

    cy.get('[data-cy="last-name"] input').click().clear().type('New Last Name');

    // Click the "Save Changes" button
    cy.get('[data-cy="save-changes"]').click();

    // Assert that the success message is displayed
    cy.contains('New First Name' && 'New Last Name').should('be.visible');

    // Revert information back to normal or will update in database
    cy.get('[data-cy="first-name"] input').click().clear().type('user');

    cy.get('[data-cy="last-name"] input').click().clear().type('test');

    cy.get('[data-cy="save-changes"]').click();
  });

  it('should update email', () => {
    // Type a new email in the UpdateEmailField component
    cy.get('[data-cy="email"] input')
      .click()
      .clear()
      .type('newemail@example.com');

    // Click the "Save Changes" button
    cy.get('[data-cy="save-changes"]').click();

    // Assert that the success message is displayed
    cy.contains('newemail@example.com').should('be.visible');

    // Revert information back to normal or will update in database
    cy.get('[data-cy="email"] input').click().clear().type('test@gmail.com');

    cy.get('[data-cy="save-changes"]').click();
  });
});
