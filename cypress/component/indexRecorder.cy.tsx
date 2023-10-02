import React from 'react';
import Recorder from '../../app/components/Recorder';
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
    cy.get('button').click();

    cy.get('button').should('have.text', 'Stop');
  });

  it('stops recording', () => {
    cy.mount(
      <RecorderProvider>
        <ErrorModalContextProvider>
          <Recorder />
        </ErrorModalContextProvider>
      </RecorderProvider>,
    );

    cy.get('button').click();
    cy.wait(2000);
    cy.get('button').click();
    cy.intercept(
      {
        method: 'POST',
        url: 'http://localhost:3000/audio/upload',
      },
      ['url'],
    );
  });
});
