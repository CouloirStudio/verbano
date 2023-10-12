import gql from 'graphql-tag';

// graphql/queries/getNotes.ts
export const GET_PROJECTS_AND_NOTES = gql`
  query {
    listProjects {
      id
      projectName
      notes {
        id
        noteName
        audioLocation
        dateCreated
        transcription
        tags
        projectId
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
