import React from 'react';
import Playback from '@/app/components/Audio/Playback/Playback';
import { ErrorModalContextProvider } from '@/app/contexts/ErrorModalContext';
import ErrorModal from '@/app/components/Modals/ErrorModal';
import { NoteType } from '@/app/graphql/resolvers/types';

describe('<Playback />', () => {
  beforeEach(() => {
    const exampleNote: NoteType = {
      id: '1',
      audioLocation: 'audio-files/audiosample.wav',
      dateCreated: new Date(),
      transcription: 'This is a sample transcription',
      tags: ['tag1', 'tag2'],
      projectId: 'project1',
      noteName: 'Sample Note',
      noteDescription: 'This is a sample note description',
    };

    cy.mount(
      <ErrorModalContextProvider>
        <ErrorModal />
        <Playback baseUrl="https://localhost:3000" selectedNote={exampleNote} />
      </ErrorModalContextProvider>,
    );

    // stubbing network request
    cy.fixture('audiosample.wav', null).then((data) => {
      data = data.buffer;
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      const json = { success: true, signedURL: url };
      cy.intercept('POST', 'https://localhost:3000/audio/retrieve', {
        statusCode: 200, // 200 OK
        body: json,
      }).as('getAudio');
    });
  });

  it('Has initial state of idle', () => {
    // see: https://on.cypress.io/mounting-react
    cy.get('img').invoke('attr', 'alt').should('eq', 'Play');
  });

  it('Updates state to Playing when clicked once', () => {
    cy.wait(1000);
    cy.get('button').click();
    cy.wait('@getAudio');
    cy.get('img').invoke('attr', 'alt').should('eq', 'Pause');
  });

  it('Updates state to Paused when clicked once', () => {
    cy.get('button').click();
    cy.wait('@getAudio');
    cy.wait(1000);
    cy.get('button').click();
    cy.get('img').invoke('attr', 'alt').should('eq', 'Resume');
  });

  it('Updates state to idle when recording is finished.', () => {
    cy.get('button').first().click();
    cy.wait(2000);
    cy.get('img').invoke('attr', 'alt').should('eq', 'Play');
  });
});

describe('Playback Error Handling', () => {
  beforeEach(() => {
    const exampleNote: NoteType = {
      id: '1',
      audioLocation: 'path/to/audiofile.mp3',
      dateCreated: new Date(),
      transcription: 'This is a sample transcription',
      tags: ['tag1', 'tag2'],
      projectId: 'project1',
      noteName: 'Sample Note',
      noteDescription: 'This is a sample note description',
    };
    cy.mount(
      <ErrorModalContextProvider>
        <ErrorModal />
        <Playback baseUrl="https://localhost:3000" selectedNote={exampleNote} />
      </ErrorModalContextProvider>,
    );
  });

  it('Handles error on bad request', () => {
    cy.intercept('POST', 'https://localhost:3000/audio/retrieve', {
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
