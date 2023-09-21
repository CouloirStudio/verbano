import React from 'react';
import { useMutation } from '@apollo/client';

import { gql } from 'apollo-boost';

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;
const LogoutButton = () => {
  const [logout] = useMutation(LOGOUT_MUTATION);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
