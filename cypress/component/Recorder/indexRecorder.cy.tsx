import React from 'react';
import Recorder from '../../../app/components/Recorder';
import ErrorModal from '../../../app/components/ErrorModal';
import { RecorderProvider } from '@/app/contexts/RecorderContext';
import { ErrorModalContextProvider } from '@/app/contexts/ErrorModalContext';

describe('<Recorder />', () => {
  beforeEach(() => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <RecorderProvider>
        <ErrorModalContextProvider>
          <ErrorModal></ErrorModal>
          <Recorder />
        </ErrorModalContextProvider>
      </RecorderProvider>,
    );
  });
  it('starts recording', () => {
    cy.get('#recorderButton').should('have.text', 'Start');
    cy.get('#recorderButton').click();
    cy.get('#recorderButton').should('have.text', 'Stop');
    cy.get('#errorTitle').should('not.exist');
  });

  it('stops recording', () => {
    cy.get('#recorderButton').click();
    cy.wait(1000);
    cy.get('#recorderButton').should('have.text', 'Stop');
    cy.get('#recorderButton').click();
    //intercepting audio upload and pretending it was successful
    cy.intercept('POST', 'http://localhost:3000/audio/upload', {
      statusCode: 200, // 200 OK
      body: {
        success: true,
        message: 'Successfully uploaded.',
      },
    }).as('uploadRequest');
    cy.wait(1000);
    cy.get('#recorderButton').should('have.text', 'Start');
    cy.get('#errorTitle').should('not.exist');
  });

  it('Renders Error Modal', () => {
    cy.stub(navigator.mediaDevices, 'getUserMedia').returns(
      new Error('Ruh Roh Raggy'),
    );
    cy.get('#recorderButton').click();
    cy.get('#errorTitle').should('exist');
  });
});
