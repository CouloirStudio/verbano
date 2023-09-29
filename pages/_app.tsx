import { useRouter } from 'next/router';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Layout from '../app/components/Layout/index';
import { ProjectProvider } from '../app/contexts/ProjectContext';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isSettingsPage = router.pathname.startsWith('/settings');
  const isLoginOrRegisterOrSettingsPage = ['/login', '/register']
          .includes(router.pathname) || router.pathname.startsWith('/settings');

  const client: ApolloClient<unknown> = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
  });

  const PageContent = (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );

  return (
    <ProjectProvider>
      {isLoginOrRegisterOrSettingsPage ? PageContent : <Layout>{PageContent}</Layout>}
    </ProjectProvider>
  );
}

export default MyApp;
