import {gql} from "apollo-boost";

const CURRENT_USER_QUERY = gql`
    query CurrentUserQuery {
        currentUser {
            id
            firstName
            lastName
            email
        }
    }
`;


export default {
  CURRENT_USER_QUERY,
}