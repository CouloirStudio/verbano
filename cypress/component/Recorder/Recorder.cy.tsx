import React from 'react';
import { AudioRecorder } from '@/app/api/recorder';
import Recorder from '../../../app/components/Audio/Recorder';
import ErrorModal from '../../../app/components/Modals/ErrorModal';
import { ErrorModalContextProvider } from '@/app/contexts/ErrorModalContext';
import client from '../../../app/config/apolloClient';
import {
  NoteType,
  ProjectNoteType,
  ProjectType,
} from '@/app/graphql/resolvers/types';

describe('<Recorder />', () => {
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

    const projectNote: ProjectNoteType = {
      note: exampleNote,
      position: 1,
    };
    const exampleProject: ProjectType = {
      id: '1',
      projectName: 'test',
      projectDescription: 'test',
      notes: [projectNote],
    };

    cy.mount(
      <ErrorModalContextProvider>
        <ErrorModal></ErrorModal>
        <Recorder
          refreshNoteDetails={cy.stub()}
          selectedNote={exampleNote}
          selectedProject={exampleProject}
        />
      </ErrorModalContextProvider>,
    );
    const recorder = AudioRecorder.getRecorder();
    cy.stub(recorder, 'cleanup');

    cy.intercept('POST', 'https://localhost:3000/audio/upload', {
      statusCode: 200, // 200 OK
      body: {
        success: true,
        message: 'Successfully uploaded.',
      },
    }).as('uploadRequest');

    cy.stub(client, 'query');
  });

  it('starts recording', () => {
    cy.get('img').invoke('attr', 'alt').should('eq', 'Record');
    cy.get('button').click();
    cy.get('img').invoke('attr', 'alt').should('eq', 'Stop');
    cy.get('#errorTitle').should('not.exist');
  });

  it('stops recording', () => {
    cy.get('button').click();
    cy.wait(1000);
    cy.get('img').invoke('attr', 'alt').should('eq', 'Stop');
    cy.get('button').click();
    cy.wait('@uploadRequest');
    cy.get('img').invoke('attr', 'alt').should('eq', 'Record');
    cy.get('#errorTitle').should('not.exist');
  });

  it('Renders Error Modal', () => {
    cy.stub(navigator.mediaDevices, 'getUserMedia').returns(new Error());
    cy.get('button').click();
    cy.get('#errorTitle').should('exist');
    cy.get('#errorMessage').should(
      'have.text',
      'Cannot access the microphone. Please ensure you have a working microphone and try again.',
    );
  });
});
