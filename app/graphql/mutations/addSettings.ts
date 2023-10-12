import { gql } from 'apollo-boost';

export const UPDATE_FULL_NAME_MUTATION = gql`
  mutation UpdateFullName(
    $email: String!
    $firstName: String!
    $lastName: String!
  ) {
    updateFullName(email: $email, firstName: $firstName, lastName: $lastName) {
      email
      firstName
      lastName
    }
  }
`;

export const UPDATE_EMAIL_MUTATION = gql`
  mutation UpdateEmail($email: String!, $newEmail: String!) {
    updateEmail(email: $email, newEmail: $newEmail) {
      email
    }
  }
`;

export const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePassword(
    $password: String!
    $newPassword: String!
    $email: String!
  ) {
    updatePassword(
      password: $password
      newPassword: $newPassword
      email: $email
    ) {
      password
    }
  }
`;
