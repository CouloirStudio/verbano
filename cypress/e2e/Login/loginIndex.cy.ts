describe('template spec', () => {
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

    cy.get('#loginButton').click().next().should('contain', 'Welcome');
  })

  it('errors on invalid credentials', () => {

  })
})