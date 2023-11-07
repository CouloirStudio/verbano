import { gql } from 'apollo-server-express';

/**
 * GraphQL schema for the Project type and associated operations.
 */
const ProjectSchema = gql`
  type Project {
    id: ID!
    projectName: String!
    projectDescription: String
    notes: [ProjectNote]!
  }

  type ProjectNote {
    note: Note
    position: Int
  }

  type PositionedProject {
    project: Project
    position: Int
  }

  input ProjectInput {
    projectName: String
    notes: [NoteInput!]
    projectDescription: String
  }

  extend type Query {
    listProjects: [PositionedProject]!
    getProject(id: ID!): Project
  }

  extend type Mutation {
    addProject(input: ProjectInput!): Project!
    deleteProject(id: ID!): Boolean!
    updateProject(id: ID!, input: ProjectInput!): Project!
    moveProjectOrder(projectId: ID!, order: Int!): Project!
  }
`;

export default ProjectSchema;
