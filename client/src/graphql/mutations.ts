import {gql} from '@apollo/client';

export const CREATE_TRANSCRIPTION_MUTATION = gql`
  mutation CreateTranscription($audioData: Upload!) {
    createTranscription(audioData: $audioData) {
      transcript
      id
    }
  }
`;
// Define other mutations as needed
