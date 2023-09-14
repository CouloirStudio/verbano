import {gql} from 'apollo-server-express';

const User = gql`
    type User {
        id: ID!
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
        user(id: ID!): User
    }

    type Mutation {
        registerUser(registerInput: RegisterInput): User
        loginUser(loginInput: LoginInput): User
    }
`;

export default User;
