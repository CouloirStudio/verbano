import gql from 'graphql-tag';

export const ADD_PROJECT = gql`
  mutation AddProject($input: ProjectInput!) {
    addProject(input: $input) {
      id
      projectName
      projectDescription
    }
  }
`;
