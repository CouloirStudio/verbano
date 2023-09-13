import { gql } from 'apollo-server-express';

const UserSchema = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
  }
`;

export default UserSchema;
