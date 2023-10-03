import gql from 'graphql-tag';

export const ADD_NOTE = gql`
  mutation AddNote($input: NoteInput!) {
    addNote(input: $input) {
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

export const UPDATE_NOTE = gql`
  mutation UpdateNote($id: ID!, $input: NoteInput!) {
    updateNote(id: $id, input: $input) {
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

export const DELETE_NOTE = gql`
  mutation DeleteNote($id: ID!) {
    deleteNote(id: $id)
  }
`;
