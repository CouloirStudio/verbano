import React from 'react';
import Playback from '@/app/components/Playback/Playback';
import { ErrorModalContextProvider } from '@/app/contexts/ErrorModalContext';
import ErrorModal from '@/app/components/ErrorModal';

describe('<Playback />', () => {
  beforeEach(() => {
    cy.mount(
      <ErrorModalContextProvider>
        <ErrorModal />
        <Playback
          audioUrl="audio-files/1696394886454.wav"
          baseUrl="http://localhost:3000"
        />
        <Playback
          audioUrl="audio-files/1697487143891.wav"
          baseUrl="http://localhost:3000"
        />
      </ErrorModalContextProvider>,
    );

    // stubbing network request
    cy.fixture('audiosample.wav', null).then((data) => {
      data = data.buffer;
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      const json = { success: true, signedURL: url };
      cy.intercept('POST', 'http://localhost:3000/audio/retrieve', {
        statusCode: 200, // 200 OK
        body: json,
      }).as('getAudio');
    });
  });

  it('Has initial state of idle', () => {
    // see: https://on.cypress.io/mounting-react
    cy.get('button').first().contains('Play');
    cy.get('button').eq(1).contains('Play');
  });

  it('Updates state to Playing when clicked once', () => {
    cy.wait(1000);
    cy.get('button').first().click();
    cy.wait('@getAudio');
    cy.get('button').first().contains('Pause');
    cy.get('button').eq(1).contains('Play');
  });

  it('Updates state to Paused when clicked once', () => {
    cy.get('button').first().click();
    cy.wait('@getAudio');
    cy.wait(1000);
    cy.get('button').first().click();
    cy.get('button').first().contains('Resume');
    cy.get('button').eq(1).contains('Play');
  });

  it('Updates state to idle when recording is finished.', () => {
    cy.get('button').first().click();
    cy.wait(2000);
    cy.get('button').first().contains('Play');
  });
});

describe('Playback Error Handling', () => {
  beforeEach(() => {
    cy.mount(
      <ErrorModalContextProvider>
        <ErrorModal />
        <Playback
          audioUrl="s3://verbano-dev-audio/audio-files/1696394886454.wav"
          baseUrl="http://localhost:3000"
        />
        <Playback
          audioUrl="s3://verbano-dev-audio/audio-files/1696394886454.wav"
          baseUrl="http://localhost:3000"
        />
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
    cy.get('button').first().click();

    cy.wait('@getAudioRequest');
    cy.get('#errorTitle').should('exist');
  });
});
