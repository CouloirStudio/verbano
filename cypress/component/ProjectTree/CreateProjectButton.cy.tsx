import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import CreateProjectButton from '../../../app/components/ProjectTree/CreateProjectButon';
import { ProjectProvider } from '../../../app/contexts/ProjectContext';

describe('<CreateProjectButton />', () => {
  it('renders', () => {
    cy.mount(
      <MockedProvider>
        <ProjectProvider>
          <CreateProjectButton />
        </ProjectProvider>
      </MockedProvider>,
    );

    cy.get('button').click({ force: true });

    //check if MUI circular progress is rendered
    cy.get('svg').should('be.visible');
  });
});
