import { gql } from 'apollo-server-express';

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
