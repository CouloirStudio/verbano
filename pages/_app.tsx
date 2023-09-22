import { useRouter } from 'next/router';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Layout from '../app/components/Layout/index';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLoginOrRegisterPage = ['/login', '/register'].includes(
    router.pathname,
  );

  const client: ApolloClient<unknown> = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
  });

  const PageContent = (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );

  return isLoginOrRegisterPage ? PageContent : <Layout>{PageContent}</Layout>;
}

export default MyApp;
