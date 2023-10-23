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

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;
