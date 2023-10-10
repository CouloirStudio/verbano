import React from 'react';
import Playback from '@/app/components/Playback/Playback';
import { ErrorModalContextProvider } from '@/app/contexts/ErrorModalContext';
import ErrorModal from '@/app/components/ErrorModal';

describe('<Playback />', () => {
  beforeEach(() => {
    cy.mount(
      <ErrorModalContextProvider>
        <ErrorModal />
        <Playback />
      </ErrorModalContextProvider>,
    );
    // stubbing network request
    cy.fixture('audiosample.wav', null).then((data) => {
      data = data.buffer;
      cy.intercept('POST', 'http://localhost:3000/audio/retrieve', {
        statusCode: 200, // 200 OK
        headers: { 'Content-Type': 'audio/wav' },
        body: data,
      }).as('getAudio');
    });
  });
  it('Has initial state of idle', () => {
    // see: https://on.cypress.io/mounting-react
    cy.get('#playbackButton').contains('Play');
  });

  it('Updates state to Playing when clicked once', () => {
    cy.wait(1000);

    cy.get('#playbackButton').click();
    cy.wait('@getAudio');
    cy.get('#playbackButton').contains('Pause');
  });

  it('Updates state to Paused when clicked once', () => {
    cy.get('#playbackButton').click();
    cy.wait('@getAudio');
    cy.get('#playbackButton').click();
    cy.wait(1000);
    cy.get('#playbackButton').contains('Resume');
  });

  it('Updates state to idle when recording is finished.', () => {
    cy.get('#playbackButton').click();
    cy.wait(2000);
    cy.get('#playbackButton').contains('Play');
  });
});

describe('Playback Error Handling', () => {
  beforeEach(() => {
    cy.mount(
      <ErrorModalContextProvider>
        <ErrorModal />
        <Playback />
      </ErrorModalContextProvider>,
    );
  });

  it('Handles error on bad request', () => {
    cy.intercept('POST', 'http://localhost:3000/audio/retrieve', {
      statusCode: 400, // 400 not okay
      body: {
        success: false,
        StatusText: 'test',
      },
    }).as('getAudioRequest');
    cy.get('#playbackButton').click();

    cy.wait('@getAudioRequest');
    cy.get('#errorTitle').should('exist');
  });
});
