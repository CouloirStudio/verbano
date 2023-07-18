import {gql} from '@apollo/client';

export const GET_TRANSCRIPTIONS_QUERY = gql`
  query GetTranscriptions {
    transcriptions {
      id
      transcript
    }
  }
`;
// Define other queries as needed
