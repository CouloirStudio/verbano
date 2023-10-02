import React from 'react';
import RecordButton from '../../app/components/Recorder/RecordButton';

describe('<RecordButton />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<RecordButton isRecording={false} />);
  });

  it('renders2', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<RecordButton isRecording={true} />);
  });
});
