import { gql } from 'apollo-server-express';
import UserSchema from './UserSchema';

const RootSchema = gql`
  type Query {
    _empty: String
  }
`;

const typeDefs = [RootSchema, UserSchema];

export default typeDefs;
