import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'https://localhost:3000/graphql',
  credentials: 'include',
});

/**
 * a function to initiate the apollo client.
 * @returns ApolloClient
 */
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
