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
    projectId: ID!
    noteName: String!
    noteDescription: String
  }

  input NoteInput {
    audioLocation: String
    transcription: String
    tags: [String!]
    projectId: ID!
    noteName: String!
    noteDescription: String
  }

  extend type Query {
    getNote(id: ID!): Note
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
