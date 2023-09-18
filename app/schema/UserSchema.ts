import {gql} from 'apollo-server-express';

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

    input RegisterInput {
        email: String!
        password: String!
        firstName: String!
        lastName: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }

    type Query {
        currentUser: User
    }

    type AuthPayload {
        user: User
    }

    type Mutation {
        registerUser(registerInput: RegisterInput): User
        loginUser(loginInput: LoginInput): User
        login(email: String!, password: String!): AuthPayload
        logout: Boolean
    }
`;

export default typeDefs;
