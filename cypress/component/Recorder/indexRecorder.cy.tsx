import React from 'react';
import Recorder from '../../../app/components/Recorder';
import { RecorderProvider } from '@/app/contexts/RecorderContext';
import { ErrorModalContextProvider } from '@/app/contexts/ErrorModalContext';

describe('<Recorder />', () => {
  it('starts recording', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <RecorderProvider>
        <ErrorModalContextProvider>
          <Recorder />
        </ErrorModalContextProvider>
      </RecorderProvider>,
    );
    cy.get('#recorderButton').should('have.text', 'Start');
    cy.get('#recorderButton').click();
    cy.get('#recorderButton').should('have.text', 'Stop');
  });

  it('stops recording', () => {
    cy.mount(
      <RecorderProvider>
        <ErrorModalContextProvider>
          <Recorder />
        </ErrorModalContextProvider>
      </RecorderProvider>,
    );
    cy.get('#recorderButton').click();
    cy.wait(1000);
    cy.get('#recorderButton').should('have.text', 'Stop');
    cy.get('#recorderButton').click();
    cy.intercept(
      {
        method: 'POST',
        url: 'http://localhost:3000/audio/upload',
      },
      ['url'],
    );
    cy.wait(1000);
    cy.get('#recorderButton').should('have.text', 'Start');
  });

  it('Renders Error Modal', () => {});
});
