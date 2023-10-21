import gql from 'graphql-tag';

// graphql/queries/getNotes.ts
export const GET_PROJECTS_AND_NOTES = gql`
  query {
    listProjects {
      id
      projectName
      notes {
        note {
          id
          noteName
          audioLocation
          dateCreated
          transcription
          tags
        }
        position
      }
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    getProject(id: $id) {
      id
      projectName
      notes {
        note {
          id
        }
        position
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
      noteName
      noteDescription
    }
  }
`;
