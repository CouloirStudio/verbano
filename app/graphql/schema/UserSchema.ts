import { gql } from "apollo-server-express";

/**
 * Graphql schema for the user type and associated operations.
 */
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
  }

  type AuthPayload {
    user: User
  }

  type Mutation {
    signup(input: UserInput!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    logout: Boolean
    updateUser(id: ID!, input: UserInput!): Boolean
    updateUserPassword(id: ID!, input: PasswordUpdateInput!): Boolean
    deleteUserAccount(id: ID!, input: UserInput!): Boolean
  }

  input UserInput {
    email: String
    firstName: String
    lastName: String
    password: String
  }

  input PasswordUpdateInput {
    oldPass: String
    newPass: String
    newPassConfirm: String
  }
`;

export default typeDefs;
