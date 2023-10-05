import React from 'react';
import Playback from './Playback';
import { ErrorModalContextProvider } from '@/app/contexts/ErrorModalContext';
import ErrorModal from '@/app/components/ErrorModal';

describe('<Playback />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <ErrorModalContextProvider>
        <ErrorModal />
        <Playback />
      </ErrorModalContextProvider>,
    );
  });
});
