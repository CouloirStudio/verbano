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
