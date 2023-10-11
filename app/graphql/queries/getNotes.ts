import gql from 'graphql-tag';

export const GET_PROJECTS_AND_NOTES = gql`
  query {
    listProjects {
      id
      projectName
      notes
    }
  }
`;

export const GET_NOTE = gql`
  query GetNote($id: ID!) {
    getNote(id: $id) {
      id
      audioLocation
      dateCreated
      transcription
      tags
      projectId
      noteName
      noteDescription
    }
  }
`;
