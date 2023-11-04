import { gql } from '@apollo/client';

export const CHECK_CURRENT_PASSWORD_QUERY = gql`
    query CheckCurrentPassword($email: String!, $password: String!) {
        checkCurrentPassword(email: $email, password: $password)
    }
`;
