import {gql} from "apollo-boost";

const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            user {
                id
                firstName
                lastName
                email
            }
        }
    }
`;

const SIGNUP_MUTATION = gql`
    mutation Signup($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
        signup(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
            user {
                id
                firstName
                lastName
                email
            }
        }
    }
`;


export default {
  LOGIN_MUTATION,
  SIGNUP_MUTATION
}