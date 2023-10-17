import React from 'react';
import {MockedProvider} from "@apollo/client/testing";
import CreateProjectButton from "../../../app/components/ProjectTree/CreateProjectButon";

describe('<CreateProjectButton />', () => {
  it('renders', () => {
    cy.mount(
      <MockedProvider>
        <CreateProjectButton/>
      </MockedProvider>
    );

    cy.get('button').click({force: true});

    //check if MUI circular progress is rendered
    cy.get('svg').should('be.visible');
  });
});