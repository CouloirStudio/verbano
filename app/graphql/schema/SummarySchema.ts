import { gql } from 'apollo-server-express';

/**
 * GraphQL schema for the Summary type and associated operations.
 */
const SummarySchema = gql`
  type Summary {
    id: ID!
    summaryName: String!
    summaryDescription: String
    content: String
    dateCreated: String!
    templateId: ID
    projectId: ID!
    noteIds: [ID!]
  }

  input SummaryInput {
    summaryName: String!
    summaryDescription: String
    content: String
    dateCreated: String
    templateId: ID
    projectId: ID!
    noteIds: [ID!]
  }

  extend type Query {
    getSummary(id: ID!): Summary
    listSummaries(projectId: ID!): [Summary!]!
  }

  extend type Mutation {
    addSummary(input: SummaryInput!): Summary!
    updateSummary(id: ID!, input: SummaryInput!): Summary!
    deleteSummary(id: ID!): Boolean!
  }
`;

export default SummarySchema;
