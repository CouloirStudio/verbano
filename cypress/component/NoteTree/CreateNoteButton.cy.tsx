import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { ProjectProvider } from '../../../app/contexts/ProjectContext';
import CreateNoteButton from '../../../app/components/NoteTree/CreateNoteButton';

describe('<CreateProjectButton />', () => {
  it('renders', () => {
    cy.mount(
      <MockedProvider>
        <ProjectProvider>
          <CreateNoteButton />
        </ProjectProvider>
      </MockedProvider>,
    );

    cy.get('button').click({ force: true });

    //check if MUI circular progress is rendered
    cy.get('svg').should('be.visible');
  });
});
