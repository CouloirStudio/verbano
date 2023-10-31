import {gql} from 'apollo-server-express';

/**
 * GraphQL schema for the Project type and associated operations.
 */
const ProjectSchema = gql`
  type Project {
    id: ID!
    projectName: String!
    projectDescription: String
    notes: [ProjectNote]
    summaries: [ProjectSummary]
  }

  type ProjectNote {
    note: Note
    position: Int
  }

  type ProjectSummary {
    summary: Summary
    position: Int
  }

  input ProjectInput {
    projectName: String!
    notes: [NoteInput!]
    projectDescription: String
  }

  extend type Query {
    listProjects: [Project!]!
    getProject(id: ID!): Project
  }

  extend type Mutation {
    addProject(input: ProjectInput!): Project!
    deleteProject(id: ID!): Boolean!
  }
`;

export default ProjectSchema;
