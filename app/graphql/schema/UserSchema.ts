import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    facebookId: String!
    googleId: String!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    profilePicture: String
    registeredIP: String
    lastLoginIP: String
    settings: UserSettings
    refreshToken: String
  }

  type UserSettings {
    darkMode: Boolean
    notifications: Boolean
  }

  type Query {
    currentUser: User
    checkCurrentPassword(email: String! password: String!): Boolean
  }

  type AuthPayload {
    user: User
  }

  type Mutation {
    signup(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
    ): AuthPayload
    login(email: String!, password: String!): AuthPayload
    logout: Boolean
    updateFullName(email: String!, firstName: String!, lastName: String!): User
    updateEmail(email: String!, newEmail: String!): User
    updatePassword(
      password: String!
      newPassword: String!
      email: String!
    ): User
  }
`;

export default typeDefs;
