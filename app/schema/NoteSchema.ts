import { gql } from 'apollo-server-express';

const NoteSchema = gql`
  type Note {
    id: ID!
    audioLocation: String!
    dateCreated: String!
    transcription: String
    tags: [String!]
    projectId: ID!
    noteName: String!
    noteDescription: String
  }

  input NoteInput {
    audioLocation: String!
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
    deleteNote(id: ID!): Boolean!
  }
`;

export default NoteSchema;
