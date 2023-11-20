/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add(
  'login',
  (email = 'test@gmail.com', password = 'password') => {
    const LOGIN_MUTATION = `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        user {
          id
          email
        }
      }
    }
  `;

    cy.request({
      method: 'POST',
      url: 'https://localhost:3000/graphql',
      body: {
        query: LOGIN_MUTATION,
        variables: {
          email: email,
          password: password,
        },
      },
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      // At this point, if login was successful, the session cookie should be set by your server
      // Cypress will automatically include this cookie in subsequent requests ensuring the user remains logged in
    });
  },
);
