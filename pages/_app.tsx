import { useRouter } from 'next/router';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Layout from '../app/components/Layout/index';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development' && router.pathname === '/login') {
  //     router.push('/');
  //   }
  // }, [router]);

  const noHeaderSidebar = router.pathname === '/login';

  let client: ApolloClient<any>;
  client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Layout noHeaderSidebar={noHeaderSidebar}>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
