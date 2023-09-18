//import graphql resolvers


import {afterEach} from "@jest/globals";
import {ApolloServer} from "apollo-server-express";
import {makeExecutableSchema} from "@graphql-tools/schema";
import {createTestClient} from 'apollo-server-testing';
import {typeDefs} from '../app/resolvers/UserResolvers';
import {User} from "@/app/models"; // Update with the correct path


// Create a mock schema using graphql-tools

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {Mutation: {registerUser}},
});

const {mutate} = createTestClient(new ApolloServer({schema}));

// Mock the User model functions
jest.mock('../models/User', () => ({
  findById: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
}));


describe('UserAuthenticationService', () => {

  beforeEach(() => {
    // Reset the mock implementations and clear the mock calls for each test
    User.findById.mockReset();
    User.findOne.mockReset();
    User.create.mockReset();
    hashPassword.mockReset();
  });

  afterEach(() => {

  });
});