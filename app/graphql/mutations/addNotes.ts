import gql from 'graphql-tag';

export const ADD_NOTE = gql`
  mutation AddNote($input: NoteInput!) {
    addNote(input: $input) {
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

export const UPDATE_NOTE = gql`
  mutation UpdateNote($id: ID!, $input: NoteInput!) {
    updateNote(id: $id, input: $input) {
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

export const MOVE_NOTE_TO_PROJECT = gql`
  mutation MoveNoteToProject($noteId: ID!, $projectId: ID!) {
    moveNoteToProject(noteId: $noteId, projectId: $projectId) {
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

export const MOVE_NOTE_ORDER = gql`
  mutation MoveNoteOrder($noteId: ID!, $order: Int!) {
    moveNoteOrder(noteId: $noteId, order: $order) {
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

export const DELETE_NOTE = gql`
  mutation DeleteNote($id: ID!) {
    deleteNote(id: $id)
  }
`;
