import {gql} from 'apollo-server-express';

/**
 * GraphQL schema for the Note type and associated operations.
 */
const NoteSchema = gql`
  type Note {
    id: ID!
    audioLocation: String
    dateCreated: String!
    transcription: String
    tags: [String!]
    noteName: String!
    noteDescription: String
  }

  input NoteInput {
    noteName: String
    audioLocation: String
    dateCreated: String
    transcription: String
    tags: [String!]
    noteDescription: String
    projectId: ID
  }

  extend type Query {
    getNote(id: ID!): Note
    getTranscription(id: ID!): String
    listNotes: [Note!]!
  }

  extend type Mutation {
    addNote(input: NoteInput!): Note!
    updateNote(id: ID!, input: NoteInput!): Note!
    moveNoteToProject(noteId: ID!, projectId: ID!): Note!
    moveNoteOrder(noteId: ID!, order: Int!): Note!
    deleteNote(id: ID!): Boolean!
  }
`;

export default NoteSchema;
