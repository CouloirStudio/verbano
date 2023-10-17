import { gql } from 'apollo-server-express';

/**
 * GraphQL schema for the Project type and associated operations.
 */
const ProjectSchema = gql`
  type Project {
    id: ID!
    projectName: String!
    projectDescription: String
    notes: [Note!]!
  }

  extend type Query {
    listProjects: [Project!]!
  }
`;

export default ProjectSchema;
