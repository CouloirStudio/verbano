import { gql } from 'apollo-server-express';

const ProjectSchema = gql`
  type Project {
    id: ID!
    name: String!
    notes: [Note!]!
  }

  extend type Query {
    listProjects: [Project!]!
  }
`;

export default ProjectSchema;
