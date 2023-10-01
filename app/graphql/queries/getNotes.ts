import gql from 'graphql-tag';

export const GET_PROJECTS_AND_NOTES = gql`
  query {
    listProjects {
      id
      name
      notes {
        id
        noteName
      }
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
